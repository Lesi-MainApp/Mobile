import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./api/api";

export const enrollApi = createApi({
  reducerPath: "enrollApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/enroll`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Enroll"],
  endpoints: (builder) => ({
    requestEnroll: builder.mutation({
      query: (body) => ({
        url: "/request",
        method: "POST",
        body, // { classId, studentName, studentPhone }
      }),
      invalidatesTags: ["Enroll"],
    }),

    getMyEnrollRequests: builder.query({
      query: () => "/my",
      providesTags: ["Enroll"],
    }),
  }),
});

export const {
  useRequestEnrollMutation,
  useGetMyEnrollRequestsQuery,
} = enrollApi;
