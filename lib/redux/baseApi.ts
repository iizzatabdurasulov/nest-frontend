import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setAccessToken } from "@/features/auth/authSlice";
import type { RootState } from "./store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

// Concurrent expired requests share one refresh. Session changes invalidate old responses.
let refreshPromise:
  Promise<Awaited<ReturnType<typeof rawBaseQuery>>> | undefined;
let sessionVersion = 0;
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;
  const refresh = () => {
    if (!refreshPromise) {
      const version = sessionVersion;
      refreshPromise = Promise.resolve(
        rawBaseQuery(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions,
        ),
      )
        .then((result) => {
          if (version === sessionVersion) {
            if (
              result.data &&
              typeof (result.data as { accessToken?: unknown }).accessToken ===
                "string"
            ) {
              api.dispatch(
                setAccessToken(
                  (result.data as { accessToken: string }).accessToken,
                ),
              );
            } else if (result.error?.status === 401) {
              api.dispatch(setAccessToken(""));
            }
          }
          return result;
        })
        .finally(() => {
          refreshPromise = undefined;
        });
    }
    return refreshPromise;
  };

  if (url === "/auth/refresh") return refresh();
  if (["/auth/login", "/auth/register", "/auth/logout"].includes(url)) {
    sessionVersion++;
    if (refreshPromise) await refreshPromise;
    return rawBaseQuery(args, api, extraOptions);
  }
  const version = sessionVersion;
  const token = (api.getState() as RootState).auth.accessToken;
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && token && version === sessionVersion) {
    const currentToken = (api.getState() as RootState).auth.accessToken;
    const refreshed =
      currentToken && currentToken !== token ? { data: {} } : await refresh();
    if (
      refreshed.data &&
      version === sessionVersion &&
      (api.getState() as RootState).auth.accessToken
    ) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else if (refreshed.error) {
      return refreshed;
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Products"],
  endpoints: () => ({}),
});
