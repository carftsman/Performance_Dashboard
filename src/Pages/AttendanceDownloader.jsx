import React, { useState, useEffect } from 'react';
import { attendanceService } from '../Services/attendance.service';
import { reportService } from '../Services/report.service';
import './AttendanceDownloader.css';
import { FiDownload, FiEye, FiX } from 'react-icons/fi';

const AttendanceDownloader = ({ userCode, setUsercode, startDate, setStartDate, endDate, setEndDate }) => {
  const [downloading, setDownloading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Clear preview when inputs change
  useEffect(() => {
    setPreviewData([]);
  }, [userCode, startDate, endDate]);

  // Common function to fetch and normalize attendance data
  const fetchAttendanceData = async () => {
    if (!userCode || !startDate || !endDate) {
      alert("Please select Executive and Date Range");
      return null;
    }

    try {
      const response = await attendanceService.getAttendancedetails(
        userCode,
        startDate,
        endDate
      );

      // Handle response (array directly or Axios wrapper)
      let rawData;
      if (Array.isArray(response)) {
        rawData = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        rawData = response.data;
      } else {
        rawData = [];
      }

      let attendanceArray = [];
      if (Array.isArray(rawData)) {
        attendanceArray = rawData;
      } else if (rawData && typeof rawData === 'object') {
        const possibleKeys = ['data', 'records', 'attendance', 'results', 'items', 'list', 'content', 'payload'];
        let found = false;
        for (const key of possibleKeys) {
          if (rawData[key] && Array.isArray(rawData[key])) {
            attendanceArray = rawData[key];
            found = true;
            break;
          }
        }
        if (!found) {
          const isSingleRecord = rawData.executiveId && rawData.attendanceDate;
          if (isSingleRecord) {
            attendanceArray = [rawData];
          } else {
            const values = Object.values(rawData);
            if (values.length > 0 && values.every(v => typeof v === 'object' && v !== null)) {
              attendanceArray = values;
            } else {
              attendanceArray = [];
            }
          }
        }
      } else {
        attendanceArray = [];
      }

      if (!Array.isArray(attendanceArray) || attendanceArray.length === 0) {
        alert("No attendance records found");
        return null;
      }

      // Normalize field names
      const normalized = attendanceArray.map(item => ({
       userCode: item.userCode || item.userCode || item.userCode ||userCode,
        teamleadName: item.teamleadName || item.teamlead_name || item.teamLead,
        attendanceDate: item.attendanceDate || item.date || item.attendance_date,
        loginTime: item.loginTime || item.login_time || item.login,
        latitude: item.latitude,
        longitude: item.longitude,
        createdAt: item.createdAt || item.created_at || item.created
      }));

      return normalized;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      alert("Failed to fetch attendance data");
      return null;
    }
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    const data = await fetchAttendanceData();
    if (data) {
      setPreviewData(data);
      setShowModal(true);
    } else {
      setPreviewData([]);
    }
    setPreviewLoading(false);
  };

  const handleDownload = async () => {
    let data = previewData;
    if (data.length === 0) {
      setDownloading(true);
      data = await fetchAttendanceData();
      setDownloading(false);
    }
    if (data && data.length > 0) {
      reportService.generateAttendanceExcel(data,userCode, startDate, endDate);
    } else {
      alert("No data to download");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="attendance-downloader card">
      <div className="attendance-header">
        <h2 className="attendance-title">Attendance Report</h2>
      </div>

      <div className="attendance-controls-wrapper">
        <div className="attendance-inputs">
          <div className="attendance-input-group">
            <label>Executive ID / Code</label>
            <input
              type="text"
              placeholder="e.g. EX001"
              value={userCode}
              onChange={(e) => setUsercode(e.target.value)}
              className="attendance-input"
            />
          </div>

          <div className="attendance-input-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="attendance-input"
            />
          </div>

          <div className="attendance-input-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="attendance-input"
            />
          </div>
        </div>

        <div className="attendance-actions">
          <button
            onClick={handlePreview}
            disabled={previewLoading || downloading}
            className="btn btn-secondary"
          >
            {previewLoading ? (
              <span className="spin">⏳</span>
            ) : (
              <FiEye />
            )}
            {previewLoading ? "Loading..." : "Preview"}
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading || previewLoading}
            className="btn btn-primary"
          >
            {downloading ? (
              <span className="spin">⏳</span>
            ) : (
              <FiDownload />
            )}
            {downloading ? "Downloading..." : "Download Excel"}
          </button>
        </div>
      </div>

      {/* Modal Preview */}
      {showModal && (
        <div className="attendance-modal-overlay" onClick={closeModal}>
          <div className="attendance-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="attendance-modal-header">
              <h3>Preview ({previewData.length} records)</h3>
              <button
                onClick={closeModal}
                className="attendance-modal-close"
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>
            
            <div className="attendance-modal-body">
              <div className="attendance-table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Login Time</th>
                      <th>Team Lead</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.attendanceDate}</td>
                        <td>
                         {item.loginTime ? new Date(item.loginTime + 'Z').toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'}
                        </td>
                        <td>{item.teamleadName}</td>
                        <td>{item.latitude}</td>
                        <td>{item.longitude}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDownloader;