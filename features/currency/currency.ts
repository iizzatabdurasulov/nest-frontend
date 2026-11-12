export const currencies = [
  { code: "USD", label: "AQSh dollari", symbol: "$" },
  { code: "UZS", label: "O‘zbekiston so‘mi", symbol: "so‘m" },
  { code: "EUR", label: "Yevro", symbol: "€" },
  { code: "RUB", label: "Rubl", symbol: "₽" },
] as const;

export type Currency = (typeof currencies)[number]["code"];
export type ExchangeRates = {
  rates: Record<Currency, number>;
  updatedAt: number;
};
export const BASE_CURRENCY: Currency = "USD";

export function isCurrency(value: string): value is Currency {
  return currencies.some((currency) => currency.code === value);
}

export function parseExchangeRates(value: unknown): ExchangeRates {
  if (!value || typeof value !== "object")
    throw new Error("Kurs ma’lumotlari noto‘g‘ri");
  const data = value as Record<string, unknown>;
  if (
    data.result !== "success" ||
    data.base_code !== BASE_CURRENCY ||
    typeof data.time_last_update_unix !== "number" ||
    !Number.isFinite(data.time_last_update_unix) ||
    data.time_last_update_unix <= 0 ||
    !data.rates ||
    typeof data.rates !== "object"
  )
    throw new Error("Kurs ma’lumotlari noto‘g‘ri");
  const rates = data.rates as Record<string, unknown>;
  for (const { code } of currencies) {
    if (
      typeof rates[code] !== "number" ||
      !Number.isFinite(rates[code]) ||
      Number(rates[code]) <= 0
    )
      throw new Error("Valyuta kursi mavjud emas");
  }
  if (rates.USD !== 1) throw new Error("Asosiy kurs noto‘g‘ri");
  return {
    rates: { USD: 1, UZS: Number(rates.UZS), EUR: Number(rates.EUR), RUB: Number(rates.RUB) },
    updatedAt: data.time_last_update_unix,
  };
}

export function formatCurrency(
  amount: number | string,
  currency: Currency,
  rates?: ExchangeRates["rates"],
) {
  const effectiveCurrency =
    currency === BASE_CURRENCY || rates ? currency : BASE_CURRENCY;
  const rate =
    effectiveCurrency === BASE_CURRENCY ? 1 : rates![effectiveCurrency];
  const value = Number(amount) * rate;
  return new Intl.NumberFormat(
    effectiveCurrency === "UZS" ? "uz-UZ" : "en-US",
    {
      style: "currency",
      currency: effectiveCurrency,
      minimumFractionDigits: effectiveCurrency === "UZS" ? 0 : 2,
      maximumFractionDigits: effectiveCurrency === "UZS" ? 0 : 2,
    },
  ).format(value);
}
