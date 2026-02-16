// app/store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import gradeReducer from "./features/gradeSlice";
import lessonReducer from "./features/lessonSlice";
import enrollReducer from "./features/enrollSlice";

import liveUiReducer from "./features/liveSlice";
import { liveApi } from "./liveApi";

import paperReducer from "./features/paperSlice";
import { paperApi } from "./paperApi";

import { enrollApi } from "./enrollApi";
import { authApi } from "./authApi";
import { gradeApi } from "./gradeApi";
import { userApi } from "./userApi";
import { classApi } from "./classApi";
import { lessonApi } from "./lessonApi";

// ✅ language
import languageSelectionReducer from "./features/languageSelectionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    grade: gradeReducer,
    lesson: lessonReducer,
    enroll: enrollReducer,

    liveUi: liveUiReducer,
    paper: paperReducer,

    languageSelection: languageSelectionReducer,

    [authApi.reducerPath]: authApi.reducer,
    [gradeApi.reducerPath]: gradeApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [classApi.reducerPath]: classApi.reducer,
    [lessonApi.reducerPath]: lessonApi.reducer,
    [enrollApi.reducerPath]: enrollApi.reducer,
    [paperApi.reducerPath]: paperApi.reducer,
    [liveApi.reducerPath]: liveApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      gradeApi.middleware,
      userApi.middleware,
      classApi.middleware,
      lessonApi.middleware,
      enrollApi.middleware,
      paperApi.middleware,
      liveApi.middleware
    ),
});

export default store;
