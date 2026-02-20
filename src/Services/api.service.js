// src/services/api.service.js
import axios from "axios";
import { BASE_URL } from "../config/env";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true, // ⭐ REQUIRED FOR SESSION AUTH
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  // withCredentials: true
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    // ❌ DO NOT attach Authorization header
    // ✅ Cookies are automatically attached by browser
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
      });
    }

    const { status, data } = error.response;

    if (status === 401) {
      // session expired or invalid
      return Promise.reject({
        message: "Session expired. Please login again.",
      });
    }

    if (status === 403) {
      return Promise.reject({
        message: "You are not allowed to access this resource.",
      });
    }

    if (status >= 500) {
      return Promise.reject({
        message: data?.error || "Server error. Try again later.",
      });
    }

    return Promise.reject({
      message: data?.message || "Something went wrong.",
    });
  }
);

export default api;
