// src/api/liveApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:8080";

export const liveApi = createApi({
  reducerPath: "liveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/live`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Lives"],
  endpoints: (builder) => ({
    // ✅ Student: get lives only for enrolled classes
    getStudentLives: builder.query({
      query: () => `/student`,
      providesTags: ["Lives"],
    }),
  }),
});

export const { useGetStudentLivesQuery } = liveApi;
