import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  progress: 0, // 0..1
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setProgress: (state, action) => {
      const v = Number(action.payload || 0);
      state.progress = Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0;
    },
    clearProgress: () => initialState,
  },
});

export const { setProgress, clearProgress } = progressSlice.actions;
export default progressSlice.reducer;