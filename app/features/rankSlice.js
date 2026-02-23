// app/features/rankSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  me: { rank: 0, totalCoins: 0, totalFinishedExams: 0 },
  top: [],
};

const rankSlice = createSlice({
  name: "rank",
  initialState,
  reducers: {
    setRankData: (state, action) => {
      const payload = action.payload || {};
      state.me = payload.me || initialState.me;
      state.top = Array.isArray(payload.top) ? payload.top : [];
    },
    clearRank: () => initialState,
  },
});

export const { setRankData, clearRank } = rankSlice.actions;
export default rankSlice.reducer;