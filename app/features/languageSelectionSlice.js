// app/features/languageSelectionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { language: "si" };

const languageSelectionSlice = createSlice({
  name: "languageSelection",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload === "en" ? "en" : "si";
    },
  },
});

export const { setLanguage } = languageSelectionSlice.actions;
export default languageSelectionSlice.reducer;
