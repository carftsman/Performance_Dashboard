// src/services/teamlead.service.js
import api from "./api.service";

export const teamLeadService = {
  createExecutive: (payload) =>
    api.post("/api/teamlead/create-executive", payload),
  getForms: () => 
    api.get("/api/teamlead/forms"),
};
