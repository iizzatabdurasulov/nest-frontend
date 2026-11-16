"use client";

import { Minus, Plus } from "@/components/Icon";
import { Button } from "@/components/ui/button";

export default function QuantityControl({
  quantity,
  productTitle,
  disabled = false,
  canIncrease = true,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  productTitle: string;
  disabled?: boolean;
  canIncrease?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        role="group"
        aria-label={`${productTitle} miqdori`}
        className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 p-1"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-9 rounded-full text-stone-600 hover:bg-white hover:text-[#244c3b] disabled:opacity-30"
          disabled={disabled || quantity <= 1}
          aria-label={`${productTitle} miqdorini bittaga kamaytirish`}
          onClick={onDecrease}
        >
          <Minus className="size-4" />
        </Button>
        <output
          aria-live="polite"
          aria-atomic="true"
          className="min-w-10 px-2 text-center text-sm font-semibold text-stone-900 tabular-nums"
        >
          {quantity}
        </output>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-9 rounded-full bg-white text-[#244c3b] shadow-xs hover:bg-[#e3e9d6] disabled:opacity-30"
          disabled={disabled || !canIncrease}
          aria-label={`${productTitle} miqdorini bittaga oshirish`}
          onClick={onIncrease}
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <span className="text-xs text-stone-400">dona</span>
    </div>
  );
}
