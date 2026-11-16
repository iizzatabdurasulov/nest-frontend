"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, CheckIcon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { useAddToCartMutation } from "@/features/cart/cartApi";
import { useCartSession } from "@/hooks/useCartSession";
import { apiError } from "@/lib/apiError";

export default function AddToCartButton({
  productId,
  available,
}: {
  productId: number;
  available: boolean;
}) {
  const { accessToken, sessionInitialized } = useCartSession();
  const [add, { isLoading }] = useAddToCartMutation();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function addItem() {
    setError("");
    setMessage("");
    try {
      await add(productId).unwrap();
      setMessage("Savatchaga qo‘shildi");
    } catch (error) {
      setError(apiError(error));
    }
  }
  return (
    <div className="space-y-2">
      {!accessToken && sessionInitialized && available ? (
        <Button asChild className="w-full rounded-xl" variant="outline">
          <Link href="/cart">
            <ShoppingCart /> Qo‘shish uchun kiring
          </Link>
        </Button>
      ) : (
        <Button
          type="button"
          className="w-full rounded-xl"
          disabled={
            !available || !sessionInitialized || !accessToken || isLoading
          }
          onClick={addItem}
        >
          {message ? <CheckIcon /> : <ShoppingCart />}
          {!available
            ? "Sotuvda yo‘q"
            : isLoading
              ? "Qo‘shilmoqda..."
              : "Savatchaga qo‘shish"}
        </Button>
      )}
      {message && (
        <p role="status" className="text-xs text-[#244c3b]">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
