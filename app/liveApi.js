// app/liveApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./api/api";

export const liveApi = createApi({
  reducerPath: "liveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/live`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Lives"],
  endpoints: (builder) => ({
    // ✅ Student: get lives only for enrolled classes
    getStudentLives: builder.query({
      query: () => ({ url: `/student`, method: "GET" }),
      providesTags: ["Lives"],
      transformResponse: (res) => res || { count: 0, lives: [] },
    }),
  }),
});

export const { useGetStudentLivesQuery } = liveApi;
