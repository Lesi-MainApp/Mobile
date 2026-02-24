// src/app/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./api/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({ url: "/signup", method: "POST", body }),
    }),

    verifySignupOtp: builder.mutation({
      query: ({ phonenumber, code }) => ({
        url: "/whatsapp/verify-code",
        method: "POST",
        body: { phonenumber, code },
      }),
    }),

    resendSignupOtp: builder.mutation({
      query: ({ phonenumber }) => ({
        url: "/whatsapp/send-code",
        method: "POST",
        body: { phonenumber },
      }),
    }),

    signin: builder.mutation({
      query: (body) => ({ url: "/signin", method: "POST", body }),
    }),

    // cookie clear (kept)
    signout: builder.mutation({
      query: () => ({ url: "/signout", method: "POST" }),
    }),

    // ✅ token logout (optional - if you created POST /api/auth/logout)
    logout: builder.mutation({
      query: () => ({ url: "/logout", method: "POST" }),
    }),

    // ✅ IMPORTANT: this must match your backend route:
    // POST /api/auth/student/clear-session
    clearStudentSession: builder.mutation({
      query: (body) => ({
        url: "/student/clear-session",
        method: "POST",
        body,
      }),
    }),

    forgotSendOtp: builder.mutation({
      query: ({ identifier }) => ({
        url: "/forgot-password/send-otp",
        method: "POST",
        body: { identifier },
      }),
    }),

    forgotReset: builder.mutation({
      query: (body) => ({
        url: "/forgot-password/reset",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifySignupOtpMutation,
  useResendSignupOtpMutation,
  useSigninMutation,
  useSignoutMutation,
  useLogoutMutation,
  useClearStudentSessionMutation, // ✅ THIS FIXES YOUR ERROR
  useForgotSendOtpMutation,
  useForgotResetMutation,
} = authApi;