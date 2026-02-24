import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./api/api";

export const progressApi = createApi({
  reducerPath: "progressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/progress`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getMyProgress: builder.query({
      query: () => ({
        url: `/my`,
        method: "GET",
      }),
      transformResponse: (res) => ({
        progress: Number(res?.progress || 0), // 0..1
        meta: res?.meta || null,
      }),
    }),
  }),
});

export const { useGetMyProgressQuery } = progressApi;