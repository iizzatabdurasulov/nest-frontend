"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { useGetExchangeRatesQuery } from "@/features/currency/currencyApi";
import { BASE_CURRENCY, formatCurrency } from "@/features/currency/currency";

export function useCurrency(loadRates = false) {
  const selected = useSelector((state: RootState) => state.currency.selected);
  const query = useGetExchangeRatesQuery(undefined, {
    skip: selected === BASE_CURRENCY && !loadRates,
    refetchOnMountOrArgChange: 86400,
  });
  const currency =
    selected === BASE_CURRENCY || query.data ? selected : BASE_CURRENCY;
  function format(amount: number | string) {
    return formatCurrency(amount, currency, query.data?.rates);
  }
  return { ...query, selected, currency, format };
}
