// src/services/api.service.js
import axios from "axios";
import { BASE_URL } from "../config/env";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
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
    // console.log("response from activation account",response);
    console.log("API Error:", error);
    // No response at all — network issue
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
        status: null,
        data: null,
      });
    }

    const { status, data } = error.response;
    

    // Extract the most descriptive message the server sent
    const serverMessage =
      data?.message ||
      data?.error ||
      data?.detail ||
      data?.errorMessage ||
      (typeof data === "string" ? data : null);

    if (status === 401) {
      return Promise.reject({
        message: serverMessage || "Session expired. Please login again.",
        status,
        data,
      });
    }

    if (status === 403) {
      return Promise.reject({
        message: serverMessage || "You are not allowed to access this resource.",
        status,
        data,
      });
    }

    if (status === 409) {
      // Conflict — e.g., credentials already exist / already activated
      return Promise.reject({
        message: serverMessage || "Conflict: resource already exists.",
        status,
        data,
      });
    }

    if (status === 400) {
      return Promise.reject({
        message: serverMessage || "Bad request. Please check your inputs.",
        status,
        data,
      });
    }

    if (status >= 500) {
      return Promise.reject({
        message: serverMessage || "Server error. Please try again later.",
        status,
        data,
      });
    }

    // All other errors
    return Promise.reject({
      message: serverMessage || "Something went wrong.",
      status,
      data,
    });
  }
);

export default api;
