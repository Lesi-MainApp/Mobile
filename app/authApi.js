import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080";

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

    signout: builder.mutation({
      query: () => ({ url: "/signout", method: "POST" }),
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
  useForgotSendOtpMutation,
  useForgotResetMutation,
} = authApi;
