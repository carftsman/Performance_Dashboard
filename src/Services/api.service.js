// src/services/api.service.js
import axios from "axios";
import { BASE_URL } from "../config/env";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user"); // future-ready
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
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
    // Network error
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check internet connection.",
      });
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        localStorage.clear();
        return Promise.reject({ message: "Unauthorized. Please login again." });

      case 403:
        return Promise.reject({ message: "Access denied." });

      case 500:
        return Promise.reject({
          message: data?.error || "Internal server error",
        });

      default:
        return Promise.reject({
          message: data?.message || "Something went wrong",
        });
    }
  }
);

export default api;
