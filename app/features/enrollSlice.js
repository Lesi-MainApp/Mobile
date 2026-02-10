import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalOpen: false,
  selectedClass: null, // { _id, className, ... }
  studentName: "",
  studentPhone: "",
};

const enrollSlice = createSlice({
  name: "enroll",
  initialState,
  reducers: {
    openEnrollModal: (state, action) => {
      state.modalOpen = true;
      state.selectedClass = action.payload?.selectedClass || null;
      state.studentName = action.payload?.studentName || "";
      state.studentPhone = action.payload?.studentPhone || "";
    },
    closeEnrollModal: (state) => {
      state.modalOpen = false;
      state.selectedClass = null;
      state.studentName = "";
      state.studentPhone = "";
    },
    setEnrollName: (state, action) => {
      state.studentName = String(action.payload || "");
    },
    setEnrollPhone: (state, action) => {
      state.studentPhone = String(action.payload || "");
    },
  },
});

export const { openEnrollModal, closeEnrollModal, setEnrollName, setEnrollPhone } =
  enrollSlice.actions;

export default enrollSlice.reducer;
