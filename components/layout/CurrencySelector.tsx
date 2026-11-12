"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { ChevronDownIcon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { currencies, isCurrency } from "@/features/currency/currency";
import { setCurrency } from "@/features/currency/currencySlice";
import { useCurrency } from "@/hooks/useCurrency";

export default function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { selected, currency, data, isFetching, error, refetch } =
    useCurrency(open);
  function selectCurrency(value: string) {
    if (isCurrency(value) && (value === "USD" || data))
      dispatch(setCurrency(value));
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full"
            aria-label={`Valyutani o‘zgartirish: ${currency}`}
          >
            {currency}
            <ChevronDownIcon className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-60 rounded-xl p-1.5"
        >
          <DropdownMenuLabel className="text-xs text-stone-500">
            Narxlarni ko‘rsatish valyutasi
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selected}
            onValueChange={selectCurrency}
          >
            {currencies.map((item) => (
              <DropdownMenuRadioItem
                key={item.code}
                value={item.code}
                disabled={item.code !== "USD" && !data}
                className="cursor-pointer gap-3 rounded-lg py-2.5 focus:bg-[#eff3e7] focus:text-[#244c3b]"
              >
                <span className="w-9 font-semibold">{item.code}</span>
                <span className="text-xs text-stone-500">{item.label}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          {isFetching && (
            <p role="status" className="px-2 py-2 text-xs text-stone-400">
              Kurslar yuklanmoqda...
            </p>
          )}
          {error && (
            <>
              <p role="status" className="px-2 py-2 text-xs text-rose-600">
                {data
                  ? "Kurs yangilanmadi. Oxirgi kurs ishlatilmoqda."
                  : "Kurs yuklanmadi. Narxlar USDda."}
              </p>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  void refetch();
                }}
                disabled={isFetching}
              >
                Qayta urinish
              </DropdownMenuItem>
            </>
          )}
          {data && (
            <p className="px-2 py-2 text-[10px] text-stone-400">
              Kurs sanasi:{" "}
              {new Date(data.updatedAt * 1000).toLocaleDateString("uz-UZ", {
                timeZone: "Asia/Tashkent",
              })}
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    
    </div>
  );
}
