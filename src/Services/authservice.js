// src/services/auth.service.js
import api from "./api.service";

export const authService = {
  login: (payload) =>
    api.post("/api/auth/login", payload),

  activate: (payload) =>
    api.post("/api/auth/activate", payload),

  logout: () =>
    api.post("/api/auth/logout"),
};
