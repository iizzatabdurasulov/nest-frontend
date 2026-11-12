import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "@/lib/redux/baseApi";
import { parseExchangeRates, type ExchangeRates } from "./currency";

// Separate transport: never send the backend Authorization header to the rate provider.
const rateQuery = fetchBaseQuery({
  baseUrl: "https://open.er-api.com/v6",
  timeout: 10000,
  credentials: "omit",
});
export const currencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExchangeRates: builder.query<ExchangeRates, void>({
      async queryFn(_arg, api, options) {
        const result = await rateQuery("/latest/USD", api, options);
        if (result.error) return { error: result.error };
        try {
          return { data: parseExchangeRates(result.data) };
        } catch {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Valyuta kurslari yuklanmadi",
            },
          };
        }
      },
      keepUnusedDataFor: 86400,
    }),
  }),
});
export const { useGetExchangeRatesQuery } = currencyApi;
