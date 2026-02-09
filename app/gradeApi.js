import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080";

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
    // ✅ existing
    getGrades: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      transformResponse: (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.grades)) return res.grades;
        return [];
      },
    }),

    // ✅ existing
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

    // ✅ NEW: get full grade document (includes subjects for 1-11, streams for 12-13)
    getGradeDetail: builder.query({
      query: (gradeNumber) => ({
        url: `/${gradeNumber}`,
        method: "GET",
      }),
      transformResponse: (res) => {
        // expected: { grade: {...} }
        return res?.grade || null;
      },
    }),
  }),
});

export const {
  useGetGradesQuery,
  useGetStreamsByGradeNumberQuery,
  useGetGradeDetailQuery,
} = gradeApi;
