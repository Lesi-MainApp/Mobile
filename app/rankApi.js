// app/rankApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./api/api";

export const rankApi = createApi({
  reducerPath: "rankApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/rank`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getIslandRank: builder.query({
      query: ({ limit = 50 } = {}) => ({
        url: `/island?limit=${encodeURIComponent(String(limit))}`,
        method: "GET",
      }),
      transformResponse: (res) => ({
        top: Array.isArray(res?.top) ? res.top : [],
        me: res?.me || { rank: 0, totalCoins: 0, totalFinishedExams: 0 },
      }),
    }),
  }),
});

export const { useGetIslandRankQuery } = rankApi;