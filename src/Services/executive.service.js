import api from './api.service';

export const executiveService = {
  // Fetch approved requests (forms returned for edit)
  getApprovedRequests: () => {
    return api.get('/api/request/approved');
  },

  // Resubmit an edited request
  resubmitRequest: (formId, payload) => {
    return api.put(`/api/request/${formId}/resubmit`, payload);
  }
};
