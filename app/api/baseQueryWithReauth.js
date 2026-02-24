// src/app/api/baseQueryWithReauth.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "../features/authSlice";
import { clearUser } from "../features/userSlice";

/**
 * BaseQuery wrapper:
 * - attaches token
 * - if 401 or SESSION_EXPIRED -> clear redux auth+user
 */
export const makeBaseQuery = (baseUrl) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "include",
  });

  return async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    const status = result?.error?.status;
    const code = result?.error?.data?.code;

    if (status === 401 || code === "SESSION_EXPIRED") {
      // ✅ logout everywhere
      api.dispatch(clearAuth());
      api.dispatch(clearUser());
    }

    return result;
  };
};