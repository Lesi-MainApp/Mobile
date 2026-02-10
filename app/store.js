// app/store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import gradeReducer from "./features/gradeSlice";
import lessonReducer from "./features/lessonSlice";
import enrollReducer from "./features/enrollSlice";

// ✅ NEW: live slice
import liveUiReducer from "./features/liveSlice";

// APIs
import { enrollApi } from "./enrollApi";
import { authApi } from "./authApi";
import { gradeApi } from "./gradeApi";
import { userApi } from "./userApi";
import { classApi } from "./classApi";
import { lessonApi } from "./lessonApi";

// ✅ NEW: live api
import { liveApi } from "./liveApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    grade: gradeReducer,
    lesson: lessonReducer,
    enroll: enrollReducer,

    // ✅ NEW
    liveUi: liveUiReducer,

    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [gradeApi.reducerPath]: gradeApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [classApi.reducerPath]: classApi.reducer,
    [lessonApi.reducerPath]: lessonApi.reducer,
    [enrollApi.reducerPath]: enrollApi.reducer,

    // ✅ NEW
    [liveApi.reducerPath]: liveApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(gradeApi.middleware)
      .concat(userApi.middleware)
      .concat(classApi.middleware)
      .concat(enrollApi.middleware)
      .concat(lessonApi.middleware)
      // ✅ NEW
      .concat(liveApi.middleware),
});

export default store;
