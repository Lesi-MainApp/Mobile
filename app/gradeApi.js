// app/gradeApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./api/api";

export const gradeApi = createApi({
  reducerPath: "gradeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/grade`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getGrades: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      transformResponse: (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.grades)) return res.grades;
        return [];
      },
    }),

    getStreamsByGradeNumber: builder.query({
      query: (gradeNumber) => ({
        url: `/streams/${gradeNumber}`,
        method: "GET",
      }),
      transformResponse: (res) => {
        if (Array.isArray(res?.streams)) return res.streams;
        return [];
      },
    }),

    getGradeDetail: builder.query({
      query: (gradeNumber) => ({
        url: `/${gradeNumber}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.grade || null,
    }),
  }),
});

export const {
  useGetGradesQuery,
  useGetStreamsByGradeNumberQuery,
  useGetGradeDetailQuery,
} = gradeApi;
