"use client";

import Link from "next/link";
import { ShoppingCart } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  async function addItem() {
    try {
      await add(productId).unwrap();
      toast.success("Mahsulot savatga qo‘shildi.");
    } catch (error) {
      toast.error(apiError(error));
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
          <ShoppingCart />
          {!available
            ? "Sotuvda yo‘q"
            : isLoading
              ? "Qo‘shilmoqda..."
              : "Savatchaga qo‘shish"}
        </Button>
      )}
    </div>
  );
}
