import { afterEach, expect, test } from "bun:test";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setAccessToken } from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";

const api = authApi.injectEndpoints({
  endpoints: (builder) => ({
    sessionTestResource: builder.query({
      query: (id) => `/session-test/${id}`,
    }),
  }),
});
const originalFetch = globalThis.fetch;
const stores = [];
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const store of stores.splice(0))
    store.dispatch(api.util.resetApiState());
});
function setup(handler) {
  const calls = [];
  globalThis.fetch = async (request) => {
    calls.push(request);
    return handler(request);
  };
  const store = configureStore({
    reducer: { auth: authReducer, [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
  stores.push(store);
  return { store, calls };
}
const json = (data, status = 200) => Response.json(data, { status });

test("restores a new page session with cookie credentials", async () => {
  const { store, calls } = setup(() => json({ accessToken: "restored-token" }));
  await store.dispatch(api.endpoints.restoreSession.initiate()).unwrap();
  expect(store.getState().auth).toEqual({
    accessToken: "restored-token",
    sessionInitialized: true,
  });
  expect(calls[0].method).toBe("POST");
  expect(calls[0].credentials).toBe("include");
  expect(new URL(calls[0].url).pathname).toBe("/auth/refresh");
});

test("concurrent expired requests share one refresh and retry with the new token", async () => {
  let releaseRefresh;
  const gate = new Promise((resolve) => {
    releaseRefresh = resolve;
  });
  let refreshCount = 0;
  const { store, calls } = setup(async (request) => {
    if (new URL(request.url).pathname === "/auth/refresh") {
      refreshCount++;
      await gate;
      return json({ accessToken: "new-token" });
    }
    return request.headers.get("authorization") === "Bearer new-token"
      ? json({ ok: true })
      : json({ message: "Expired" }, 401);
  });
  store.dispatch(setAccessToken("expired-token"));
  const first = store.dispatch(api.endpoints.sessionTestResource.initiate(1));
  const second = store.dispatch(api.endpoints.sessionTestResource.initiate(2));
  for (let i = 0; i < 100 && calls.length < 3; i++) await Bun.sleep(1);
  releaseRefresh();
  expect(await first.unwrap()).toEqual({ ok: true });
  expect(await second.unwrap()).toEqual({ ok: true });
  expect(refreshCount).toBe(1);
  expect(store.getState().auth.accessToken).toBe("new-token");
});

test("an expired refresh session clears authentication", async () => {
  const { store, calls } = setup(() =>
    json({ message: "Session expired" }, 401),
  );
  store.dispatch(setAccessToken("expired-token"));
  const result = await store.dispatch(
    api.endpoints.sessionTestResource.initiate(1),
  );
  expect(result.error.status).toBe(401);
  expect(store.getState().auth.accessToken).toBe("");
  expect(calls).toHaveLength(2);
});

test("a temporary refresh failure preserves the session for retry", async () => {
  const { store } = setup((request) =>
    json({}, new URL(request.url).pathname === "/auth/refresh" ? 503 : 401),
  );
  store.dispatch(setAccessToken("expired-token"));
  const result = await store.dispatch(
    api.endpoints.sessionTestResource.initiate(1),
  );
  expect(result.error.status).toBe(503);
  expect(store.getState().auth.accessToken).toBe("expired-token");
});

test("invalid login does not try to refresh", async () => {
  const { store, calls } = setup(() =>
    json({ message: "Invalid password" }, 401),
  );
  const result = await store.dispatch(
    api.endpoints.login.initiate({ email: "a@example.com", password: "wrong" }),
  );
  expect(result.error.status).toBe(401);
  expect(calls).toHaveLength(1);
});

test("logout waits for pending refresh and prevents it from restoring authentication", async () => {
  let releaseRefresh;
  const gate = new Promise((resolve) => {
    releaseRefresh = resolve;
  });
  const { store, calls } = setup(async (request) => {
    if (new URL(request.url).pathname === "/auth/refresh") {
      await gate;
      return json({ accessToken: "stale-token" });
    }
    return json({ ok: true });
  });
  const restoring = store.dispatch(api.endpoints.restoreSession.initiate());
  for (let i = 0; i < 100 && calls.length < 1; i++) await Bun.sleep(1);
  const logout = store.dispatch(api.endpoints.logout.initiate());
  releaseRefresh();
  await restoring;
  await logout.unwrap();
  expect(store.getState().auth.accessToken).toBe("");
  expect(calls.map((request) => new URL(request.url).pathname)).toEqual([
    "/auth/refresh",
    "/auth/logout",
  ]);
});
