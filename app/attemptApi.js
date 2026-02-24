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

    // ✅ supports multi or single
    saveAnswer: builder.mutation({
      query: ({ attemptId, questionId, selectedAnswerIndex, selectedAnswerIndexes }) => ({
        url: `/answer`,
        method: "POST",
        body: {
          attemptId,
          questionId,

          // multi (new)
          selectedAnswerIndexes: Array.isArray(selectedAnswerIndexes) ? selectedAnswerIndexes : undefined,

          // single (old)
          selectedAnswerIndex: typeof selectedAnswerIndex === "number" ? selectedAnswerIndex : undefined,
        },
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

    // ✅ Coins box + Finished exams box
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

  useGetMyStatsQuery,
} = attemptApi;