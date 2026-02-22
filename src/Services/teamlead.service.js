// src/services/teamlead.service.js
import api from "./api.service";

const teamLeadService = {
  createExecutive: () =>
    api.post("/api/teamlead/create-executive"),
  getForms: () => 
    api.get("/api/teamlead/forms"),
};
export default teamLeadService;