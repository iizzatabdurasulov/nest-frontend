"use client";
import { useState } from "react";
import { LogOut } from "@/components/Icon";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { baseApi } from "@/lib/redux/baseApi";
import { setAccessToken } from "@/features/auth/authSlice";
import {
  useGetAdminQuery,
  useRestoreSessionQuery,
  useLogoutMutation,
} from "@/features/auth/authApi";
import { apiError } from "@/lib/apiError";
import AdminLogin from "./AdminLogin";
import ProductManager from "./admin/ProductManager";
import EmptyState from "./shared/EmptyState";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
export default function AdminPanel() {
  const dispatch = useDispatch();
  const { accessToken: token, sessionInitialized } = useSelector(
    (state: RootState) => state.auth,
  );
  const { error: sessionError, refetch: retrySession } = useRestoreSessionQuery(
    undefined,
    {
      skip: sessionInitialized,
    },
  );
  const [endSession, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [logoutError, setLogoutError] = useState("");
  const {
    data: admin,
    isLoading,
    isFetching,
    error,
  } = useGetAdminQuery(undefined, { skip: !token });
  async function logout() {
    setLogoutError("");
    try {
      await endSession().unwrap();
      dispatch(setAccessToken(""));
      dispatch(baseApi.util.resetApiState());
    } catch (error) {
      setLogoutError(apiError(error));
    }
  }
  if (!sessionInitialized) {
    if (sessionError)
      return (
        <EmptyState
          error
          title="Sessiyani tekshirib bo‘lmadi"
          description={apiError(sessionError)}
        >
          <Button onClick={() => retrySession()}>Qayta urinish</Button>
        </EmptyState>
      );
    return <Skeleton className="mt-6 h-40 w-full rounded-2xl" />;
  }
  if (!token) return <AdminLogin />;
  if (isLoading || isFetching)
    return <Skeleton className="mt-6 h-40 w-full rounded-2xl" />;
  if (error || !admin)
    return (
      <EmptyState
        error
        title="Kirish huquqini tekshiring"
        description={apiError(error)}
      >
        {logoutError && <p role="alert">{logoutError}</p>}
        <Button disabled={isLoggingOut} onClick={logout}>
          Kirishga qaytish
        </Button>
      </EmptyState>
    );
  return (
    <>
      <div className="my-7 flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e3e9d6] text-sm font-semibold text-[#244c3b]">
          {admin.email.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{admin.email}</p>
          <p className="text-xs text-stone-400">
            {admin.role === "owner" ? "Sayt egasi" : "Administrator"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={logout}
          disabled={isLoggingOut}
        >
          <LogOut /> Chiqish
        </Button>
      </div>
      {logoutError && (
        <p role="alert" className="text-sm text-rose-600">
          {logoutError}
        </p>
      )}
      <ProductManager />
    </>
  );
}
