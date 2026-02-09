import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,

  // used for OTP + prefill signin phone
  pendingPhone: "",
  pendingEmail: "",

  // grade selection chosen before signin
  selectedLevel: null,     // "primary" | "secondary" | "al"
  selectedGrade: null,     // "Grade 3"
  selectedStream: null,    // "Maths" etc

  signupDistrict: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload || null;
    },
    clearAuth: (state) => {
      state.token = null;
      state.pendingPhone = "";
      state.pendingEmail = "";
      state.selectedLevel = null;
      state.selectedGrade = null;
      state.selectedStream = null;
      state.signupDistrict = "";
    },
    setPendingIdentity: (state, action) => {
      const { phone, email } = action.payload || {};
      state.pendingPhone = phone || "";
      state.pendingEmail = email || "";
    },
    setGradeSelection: (state, action) => {
      const { level, grade, stream } = action.payload || {};
      state.selectedLevel = level ?? null;
      state.selectedGrade = grade ?? null;
      state.selectedStream = stream ?? null;
    },
    clearGradeSelection: (state) => {
      state.selectedLevel = null;
      state.selectedGrade = null;
      state.selectedStream = null;
    },
    setSignupDistrict: (state, action) => {
      state.signupDistrict = String(action.payload || "");
    },
  },
});

export const {
  setToken,
  clearAuth,
  setPendingIdentity,
  setGradeSelection,
  clearGradeSelection,
  setSignupDistrict,
} = authSlice.actions;

export default authSlice.reducer;
