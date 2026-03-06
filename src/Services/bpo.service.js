// src/Services/bpo.service.js
import api from "./api.service";

export const bpoService = {
  // Get all BPO forms
  getForms: () =>
    api.get("/api/bpo/forms"),

  // Submit review for a specific form
  submitReview: (formId, payload) =>
    api.post(`/api/bpo/submit/${formId}`, payload),

  // Get reappear forms
  getReappearForms: () =>
    api.get("/api/bpo/reappear-forms"),
};