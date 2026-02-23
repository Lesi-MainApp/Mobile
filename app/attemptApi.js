// app/attemptApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./api/api";

export const attemptApi = createApi({
  reducerPath: "attemptApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/attempt`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    startAttempt: builder.mutation({
      query: ({ paperId }) => ({
        url: `/start`,
        method: "POST",
        body: { paperId },
      }),
    }),

    getAttemptQuestions: builder.query({
      query: ({ attemptId }) => ({
        url: `/questions/${attemptId}`,
        method: "GET",
      }),
    }),

    saveAnswer: builder.mutation({
      query: ({ attemptId, questionId, selectedAnswerIndex }) => ({
        url: `/answer`,
        method: "POST",
        body: { attemptId, questionId, selectedAnswerIndex },
      }),
    }),

    submitAttempt: builder.mutation({
      query: ({ attemptId }) => ({
        url: `/submit/${attemptId}`,
        method: "POST",
      }),
    }),

    getMyAttemptsByPaper: builder.query({
      query: ({ paperId }) => ({
        url: `/my/${paperId}`,
        method: "GET",
      }),
    }),

    getAttemptSummary: builder.query({
      query: ({ attemptId }) => ({
        url: `/summary/${attemptId}`,
        method: "GET",
      }),
    }),

    getAttemptReview: builder.query({
      query: ({ attemptId }) => ({
        url: `/review/${attemptId}`,
        method: "GET",
      }),
    }),

    // ✅ BEST result per paper
    getMyCompletedPapers: builder.query({
      query: () => ({
        url: `/completed`,
        method: "GET",
      }),
      transformResponse: (res) => {
        if (Array.isArray(res?.items)) return { items: res.items };
        return { items: [] };
      },
    }),

    // ✅ NEW: totals for dashboard boxes
    getMyStats: builder.query({
      query: () => ({
        url: `/stats`,
        method: "GET",
      }),
      transformResponse: (res) => {
        return {
          totalCoins: Number(res?.totalCoins || 0),
          totalFinishedExams: Number(res?.totalFinishedExams || 0),
        };
      },
    }),
  }),
});

export const {
  useStartAttemptMutation,
  useGetAttemptQuestionsQuery,
  useSaveAnswerMutation,
  useSubmitAttemptMutation,
  useGetAttemptReviewQuery,

  useGetMyAttemptsByPaperQuery,
  useGetAttemptSummaryQuery,

  useGetMyCompletedPapersQuery,

  // ✅ NEW
  useGetMyStatsQuery,
} = attemptApi;