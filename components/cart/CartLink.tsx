"use client";

import Link from "next/link";
import { ShoppingCart } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { useCartSession } from "@/hooks/useCartSession";
import { useGetCartQuery } from "@/features/cart/cartApi";

export default function CartLink({ active }: { active: boolean }) {
  const { accessToken } = useCartSession();
  const { currentData: cart, isError } = useGetCartQuery(undefined, {
    skip: !accessToken,
  });
  const count =
    accessToken && !isError
      ? (cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0)
      : 0;
  return (
    <Button
      asChild
      variant={active ? "default" : "outline"}
      size="sm"
      className="rounded-full"
    >
      <Link
        href="/cart"
        aria-current={active ? "page" : undefined}
        aria-label={`Savatcha, ${count} ta mahsulot`}
      >
        <ShoppingCart />
        <span className="hidden md:inline">Savatcha</span>
        {count > 0 && (
          <span className="min-w-5 rounded-full bg-[#e3e9d6] px-1.5 text-center text-xs text-[#244c3b]">
            {count}
          </span>
        )}
      </Link>
    </Button>
  );
}
