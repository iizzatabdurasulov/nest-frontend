"use client";

import { useCurrency } from "@/hooks/useCurrency";

type ProductPriceProps = {
  price: number | string;
  oldPrice: number | string | null;
  detailed?: boolean;
};

export default function ProductPrice({
  price,
  oldPrice,
  detailed = false,
}: ProductPriceProps) {
  const hasDiscount = oldPrice !== null && Number(oldPrice) > Number(price);

  const { format: formatPrice } = useCurrency();

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <strong
        className={`font-semibold tracking-tight text-zinc-900 ${
          detailed ? "text-3xl" : "text-xl"
        }`}
      >
        {formatPrice(price)}
      </strong>

      {hasDiscount && (
        <del className={`text-zinc-400 ${detailed ? "text-base" : "text-xs"}`}>
          {formatPrice(oldPrice)}
        </del>
      )}
    </div>
  );
}
