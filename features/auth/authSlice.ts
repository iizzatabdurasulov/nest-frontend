import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { accessToken: "", sessionInitialized: false },
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.sessionInitialized = true;
    },
  },
});

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;
