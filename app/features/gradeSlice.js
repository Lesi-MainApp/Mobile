import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  grades: [],
  streamsByGrade: {}, // { 12: [...], 13: [...] }
};

const gradeSlice = createSlice({
  name: "grade",
  initialState,
  reducers: {
    setGrades: (state, action) => {
      state.grades = Array.isArray(action.payload) ? action.payload : [];
    },
    setStreamsForGrade: (state, action) => {
      const { gradeNumber, streams } = action.payload || {};
      if (!gradeNumber) return;
      state.streamsByGrade[Number(gradeNumber)] = Array.isArray(streams) ? streams : [];
    },
    clearGradeStore: () => initialState,
  },
});

export const { setGrades, setStreamsForGrade, clearGradeStore } = gradeSlice.actions;
export default gradeSlice.reducer;
