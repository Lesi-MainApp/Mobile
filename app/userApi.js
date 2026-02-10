// app/userApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./api/api";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/user`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    saveStudentGradeSelection: builder.mutation({
      query: (body) => ({
        url: "/student/grade-selection",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useSaveStudentGradeSelectionMutation } = userApi;
