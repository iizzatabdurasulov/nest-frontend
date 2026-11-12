"use client";
import { useCurrency } from "@/hooks/useCurrency";
export default function CurrencyAmount({
  amount,
}: {
  amount: number | string;
}) {
  const { format } = useCurrency();
  return <span>{format(amount)}</span>;
}
