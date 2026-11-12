import { describe, expect, test } from "bun:test";
import {
  formatCurrency,
  isCurrency,
  parseExchangeRates,
} from "../features/currency/currency";
import currencyReducer, {
  setCurrency,
} from "../features/currency/currencySlice";

// Fixed fixtures test arithmetic independently of the provider's changing daily rates.
const rates = { USD: 1, UZS: 12000, EUR: 0.9 };
const response = {
  result: "success",
  base_code: "USD",
  time_last_update_unix: 1700000000,
  rates,
};

describe("currency conversion", () => {
  test("converts USD amounts instead of replacing the currency symbol", () => {
    expect(formatCurrency(100, "EUR", rates)).toBe("€90.00");
    expect(formatCurrency(100, "UZS", rates).replace(/\D/g, "")).toBe(
      "1200000",
    );
    expect(formatCurrency("12.5", "USD", rates)).toBe("$12.50");
  });
  test("falls back to USD when exchange rates are unavailable", () => {
    expect(formatCurrency(100, "UZS")).toBe("$100.00");
  });
  test("applies the same rate to current and previous prices", () => {
    expect(formatCurrency(100, "EUR", rates)).toBe("€90.00");
    expect(formatCurrency(150, "EUR", rates)).toBe("€135.00");
  });
  test("rounds UZS to whole sums", () => {
    expect(formatCurrency(1.00009, "UZS", rates).replace(/\D/g, "")).toBe(
      "12001",
    );
  });
  test("validates API results and rejects unusable rates", () => {
    expect(parseExchangeRates(response).rates).toEqual(rates);
    for (const invalid of [
      null,
      { ...response, result: "error" },
      { ...response, base_code: "EUR" },
      { ...response, rates: { ...rates, UZS: 0 } },
      { ...response, rates: { ...rates, EUR: "0.9" } },
      { ...response, rates: { ...rates, USD: 2 } },
    ]) {
      expect(() => parseExchangeRates(invalid)).toThrow();
    }
  });
  test("stores a shared currency preference", () => {
    expect(currencyReducer(undefined, { type: "init" }).selected).toBe("USD");
    expect(currencyReducer(undefined, setCurrency("UZS")).selected).toBe("UZS");
    expect(isCurrency("UZS")).toBe(true);
    expect(isCurrency("invalid")).toBe(false);
  });
});
