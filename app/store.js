// app/store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import gradeReducer from "./features/gradeSlice";
import lessonReducer from "./features/lessonSlice";
import enrollReducer from "./features/enrollSlice";

// ✅ Live UI slice
import liveUiReducer from "./features/liveSlice";

// ✅ RTK Query: Live Api (ADD)
import { liveApi } from "./liveApi";

// ✅ Paper slice + RTK Query
import paperReducer from "./features/paperSlice";
import { paperApi } from "./paperApi";

// RTK Query apis
import { enrollApi } from "./enrollApi";
import { authApi } from "./authApi";
import { gradeApi } from "./gradeApi";
import { userApi } from "./userApi";
import { classApi } from "./classApi";
import { lessonApi } from "./lessonApi";

const store = configureStore({
  reducer: {
    // slices
    auth: authReducer,
    user: userReducer,
    grade: gradeReducer,
    lesson: lessonReducer,
    enroll: enrollReducer,

    // ✅ Live UI
    liveUi: liveUiReducer,

    // ✅ Paper local slice
    paper: paperReducer,

    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [gradeApi.reducerPath]: gradeApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [classApi.reducerPath]: classApi.reducer,
    [lessonApi.reducerPath]: lessonApi.reducer,
    [enrollApi.reducerPath]: enrollApi.reducer,

    // ✅ Paper RTK Query
    [paperApi.reducerPath]: paperApi.reducer,

    // ✅ Live RTK Query (ADD)
    [liveApi.reducerPath]: liveApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // RTK Query middleware
      authApi.middleware,
      gradeApi.middleware,
      userApi.middleware,
      classApi.middleware,
      lessonApi.middleware,
      enrollApi.middleware,
      paperApi.middleware,

      // ✅ Live middleware (ADD)
      liveApi.middleware
    ),
});

export default store;
