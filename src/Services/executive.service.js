import api from './api';

// Executive services
export const submitDailyLog = async (data) => {
  return await api.post('/executive/daily-log', data);
};

export const getExecutiveStats = async (period) => {
  return await api.get(`/executive/stats?period=${period}`);
};

// Team Lead services
export const getTeamPerformance = async () => {
  return await api.get('/teamlead/team-performance');
};

export const getExecutiveDetail = async (executiveId) => {
  return await api.get(`/teamlead/executive/${executiveId}`);
};

// Management services
export const getConsolidatedReport = async (filter) => {
  return await api.get('/management/consolidated', { params: filter });
};

export const getExecutiveReport = async (executiveId, period) => {
  return await api.get(`/management/executive/${executiveId}?period=${period}`);
};