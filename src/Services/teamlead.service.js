// src/services/teamlead.service.js
import api from "./api.service";

const teamLeadService = {
 createExecutive: (executiveData) =>
  api.post("/api/teamlead/create-executive", executiveData),
  getForms: () => 
    api.get("/api/teamlead/forms"),
};
export default teamLeadService;