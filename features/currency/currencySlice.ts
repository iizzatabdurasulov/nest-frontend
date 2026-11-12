import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_CURRENCY, type Currency } from "./currency";
const currencySlice = createSlice({
  name: "currency",
  initialState: { selected: BASE_CURRENCY as Currency },
  reducers: {
    setCurrency(state, action: PayloadAction<Currency>) {
      state.selected = action.payload;
    },
  },
});
export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
