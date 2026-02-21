// src/services/form.service.js
import api from "./api.service";

export const formService = {
  getAllForms: () =>
    api.get("/api/form"),

  createForm: (payload) =>
    api.post("/api/form", payload),

  getTeamLeadForms: () =>
    api.get("/api/teamlead/forms"),
};
