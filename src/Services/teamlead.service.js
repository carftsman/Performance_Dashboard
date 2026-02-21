// src/services/teamlead.service.js
import api from "./api.service";

export const teamLeadService = {
  createExecutive: () =>
    api.post("/api/teamlead/create-executive"),
  getForms: () => 
    api.get("/api/teamlead/forms"),
};
