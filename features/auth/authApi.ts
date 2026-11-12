import { baseApi } from "@/lib/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string },
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    getAdmin: builder.query<
      { userId: number; email: string; role: "admin" | "owner" },
      void
    >({
      query: () => "/auth/admin",
    }),
  }),
});

export const { useLoginMutation, useGetAdminQuery } = authApi;
