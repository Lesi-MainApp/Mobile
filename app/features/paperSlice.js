// app/features/paperSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  papers: [],        // last loaded list (optional)
  selectedPaper: null,
};

const paperSlice = createSlice({
  name: "paper",
  initialState,
  reducers: {
    setPapers: (state, action) => {
      state.papers = Array.isArray(action.payload) ? action.payload : [];
    },
    setSelectedPaper: (state, action) => {
      state.selectedPaper = action.payload || null;
    },
    clearPaperStore: () => initialState,
  },
});

export const { setPapers, setSelectedPaper, clearPaperStore } = paperSlice.actions;
export default paperSlice.reducer;
