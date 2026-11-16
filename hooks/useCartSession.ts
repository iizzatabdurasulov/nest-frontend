"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { useRestoreSessionQuery } from "@/features/auth/authApi";

export function useCartSession() {
  const auth = useSelector((state: RootState) => state.auth);
  const session = useRestoreSessionQuery(undefined, {
    skip: auth.sessionInitialized,
  });
  return {
    ...auth,
    sessionError: session.error,
    retrySession: session.refetch,
  };
}
