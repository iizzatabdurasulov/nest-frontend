"use client";

import { useRef, useState } from "react";
import { Minus, Plus, X } from "@/components/Icon";
import { Button } from "@/components/ui/button";

export default function QuantityControl({
  quantity,
  productTitle,
  disabled = false,
  pending = false,
  canIncrease = true,
  onIncrease,
  onDecrease,
  onQuantityChange,
}: {
  quantity: number;
  productTitle: string;
  disabled?: boolean;
  pending?: boolean;
  canIncrease?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onQuantityChange: (quantity: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const value = draft ?? String(quantity);

  function commit() {
    if (draft === null) return;
    const next = Number(draft);
    setDraft(null);
    if (!disabled && draft !== "" && Number.isInteger(next) && next >= 1 && next <= 2147483647 && (canIncrease || next <= quantity)) {
      onQuantityChange(next);
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      <div
        role="group"
        aria-busy={pending}
        aria-label={`${productTitle} miqdori`}
        className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 p-1"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={`size-9 rounded-full text-stone-600 hover:bg-white hover:text-[#244c3b] ${pending ? "disabled:opacity-100" : "disabled:opacity-30"}`}
          disabled={disabled || quantity <= 1}
          aria-label={`${productTitle} miqdorini bittaga kamaytirish`}
          onClick={onDecrease}
        >
          <Minus className="size-4" />
        </Button>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={`${productTitle} soni`}
          autoComplete="off"
          disabled={disabled}
          value={value}
          onChange={(event) => {
            if (/^\d*$/.test(event.target.value)) setDraft(event.target.value);
          }}
          onFocus={(event) => event.target.select()}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.blur();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setDraft(null);
            }
          }}
          className="h-9 min-w-10 rounded-md bg-transparent px-1 text-center text-sm font-semibold text-stone-900 tabular-nums outline-none focus:ring-2 focus:ring-[#65804a]/40"
          style={{ width: `${Math.max(3, value.length + 1)}ch`, maxWidth: "12ch" }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7 rounded-full text-stone-400 hover:bg-white hover:text-stone-700"
          disabled={disabled || value === ""}
          aria-label={`${productTitle} sonini tozalash`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setDraft("");
            inputRef.current?.focus();
          }}
        >
          <X className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={`size-9 rounded-full bg-white text-[#244c3b] shadow-xs hover:bg-[#e3e9d6] ${pending ? "disabled:opacity-100" : "disabled:opacity-30"}`}
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
