// src/services/form.service.js
import api from "./api.service";

export const formService = {
  getAllForms: () =>
    api.get("/api/data/form"),

  createForm: (payload) =>
    api.post("/api/form", payload),

  getTeamLeadForms: () =>
    api.get("/api/teamlead/forms"),

   getMyHistory: () => 
    api.get("/api/form/my-history"), 

  resendRequest: (payload) =>
    api.post("/api/request/resend", payload),
};
