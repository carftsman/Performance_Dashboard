import React, { useState, useEffect } from 'react';
import { attendanceService } from '../Services/attendance.service';
import { reportService } from '../Services/report.service';

const AttendanceDownloader = ({ executiveName, setExecutiveName, startDate, setStartDate, endDate, setEndDate }) => {
  const [downloading, setDownloading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Clear preview when inputs change
  useEffect(() => {
    setPreviewData([]);
  }, [executiveName, startDate, endDate]);

  // Common function to fetch and normalize attendance data
  const fetchAttendanceData = async () => {
    if (!executiveName || !startDate || !endDate) {
      alert("Please select Executive and Date Range");
      return null;
    }

    try {
      const response = await attendanceService.getAttendancedetails(
        executiveName,
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
        executiveName: item.executiveName || item.executive_name || item.executive || executiveName,
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
      reportService.generateAttendanceExcel(data, executiveName, startDate, endDate);
    } else {
      alert("No data to download");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '90%',
    maxHeight: '80%',
    overflow: 'auto',
    position: 'relative'
  };

  return (
    <div style={{ marginTop: '20px', marginBottom: '20px', padding: '15px', borderRadius: '8px', backgroundColor: 'white' }}>
      <h2 style={{ marginBottom: '10px' }}>Attendance Report</h2>

      <input
        type="text"
        placeholder="Executive Name"
        value={executiveName}
        onChange={(e) => setExecutiveName(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />

      <button
        onClick={handlePreview}
        disabled={previewLoading || downloading}
        style={{
          backgroundColor: "#4b5563",
          color: "white",
          padding: "8px 16px",
          marginRight: '10px',
          border: "none",
          borderRadius: "5px",
          cursor: (previewLoading || downloading) ? "not-allowed" : "pointer"
        }}
      >
        {previewLoading ? "Loading..." : "Preview"}
      </button>

      <button
        onClick={handleDownload}
        disabled={downloading || previewLoading}
        style={{
          backgroundColor: downloading ? "gray" : "#2563eb",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "5px",
          cursor: (downloading || previewLoading) ? "not-allowed" : "pointer"
        }}
      >
        {downloading ? "Downloading..." : "Download Excel"}
      </button>

      {/* Modal Preview */}
      {showModal && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3>Preview ({previewData.length} records)</h3>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', marginTop: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f1f1f1' }}>
                  <tr>
                    <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Date</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Login Time</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Team Lead</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Latitude</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.attendanceDate}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                       {item.loginTime ? new Date(item.loginTime + 'Z').toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A'}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.teamleadName}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.latitude}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.longitude}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDownloader;