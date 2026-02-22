// src/Services/manager.service.js
import api from "./api.service";

export const managerService = {
  // Fetch all pending requests for the manager
  getRequests: () =>
    api.get("/api/request/manager"),

  // Approve a specific edit request
  approveRequest: (formId) =>
    api.put(`/api/request/${formId}/approve`),

  // Reject a specific edit request
  rejectRequest: (formId) =>
    api.put(`/api/request/${formId}/reject`),
};
