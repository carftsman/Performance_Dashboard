import api from "./api.service";

export const attendanceService = {
  // executiveName as path param, dates as query params
  getAttendancedetails: (executiveName, startDate, endDate) =>
    api.get(`/api/executive/attendance/${encodeURIComponent(executiveName)}`, {
      params: { startDate, endDate }   // send dates as query parameters
    })
};
