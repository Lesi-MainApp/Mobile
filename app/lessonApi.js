// app/lessonApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./api/api";

export const lessonApi = createApi({
  reducerPath: "lessonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/lesson`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getLessonsByClassId: builder.query({
      query: (classId) => ({
        url: `/class/${classId}`,
        method: "GET",
      }),
      transformResponse: (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.lessons)) return res.lessons;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      },
    }),

    getLessonById: builder.query({
      query: (lessonId) => ({
        url: `/${lessonId}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.lesson || res?.data || res || null,
    }),
  }),
});

export const { useGetLessonsByClassIdQuery, useGetLessonByIdQuery } = lessonApi;
