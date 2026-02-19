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

    getAttemptReview: builder.query({
      query: ({ attemptId }) => ({
        url: `/review/${attemptId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useStartAttemptMutation,
  useGetAttemptQuestionsQuery,
  useSaveAnswerMutation,
  useSubmitAttemptMutation,
  useGetAttemptReviewQuery,
} = attemptApi;
