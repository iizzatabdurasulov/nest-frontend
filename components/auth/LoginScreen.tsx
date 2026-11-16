"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartSession } from "@/hooks/useCartSession";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiError } from "@/lib/apiError";
import CustomerLogin from "./CustomerLogin";

export default function LoginScreen() {
  const router = useRouter();
  const { accessToken, sessionInitialized, sessionError, retrySession } =
    useCartSession();

  useEffect(() => {
    if (accessToken) router.replace("/products");
  }, [accessToken, router]);

  if (!sessionInitialized && sessionError) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <p role="alert" className="text-sm text-rose-600">
          {apiError(sessionError)}
        </p>
        <Button variant="outline" onClick={() => retrySession()}>
          Sessiyani qayta tekshirish
        </Button>
        <CustomerLogin />
      </div>
    );
  }

  if (!sessionInitialized || accessToken) {
    return (
      <Skeleton
        role="status"
        aria-label="Hisob tekshirilmoqda"
        className="mx-auto h-96 max-w-md rounded-3xl"
      />
    );
  }

  return <CustomerLogin />;
}
