// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import MainLayout from "../components/common/Layout/MainLayout";
// import "./BpoHistory.css";

// const BASE_URL = "https://mft-zwy7.onrender.com";

// function BpoHistory() {
//   const [historyForms, setHistoryForms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedForm, setSelectedForm] = useState(null);
//   const [bpoReason, setBpoReason] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const fetchHistory = async () => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/bpo-request/history`,
//         { withCredentials: true }
//       );
//       setHistoryForms(response.data);
//     } catch (error) {
//       console.error("History Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   // ✅ Manager Request API Call
//   const handleRequestManager = async () => {
//     if (!bpoReason.trim()) {
//       alert("Please enter reason");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const response = await axios.put(
//         `${BASE_URL}/api/bpo-request/request/${selectedForm.id}`,
//         { bpoReason },
//         { withCredentials: true }
//       );

//       // update UI instantly
//       setHistoryForms((prev) =>
//         prev.map((form) =>
//           form.id === selectedForm.id ? response.data : form
//         )
//       );

//       alert("Request sent to Manager successfully ✅");

//       setSelectedForm(null);
//       setBpoReason("");
//     } catch (error) {
//       console.error("Request Error:", error);
//       alert("Failed to send request");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <MainLayout>
//       <div className="history-container">
//         <h2 className="history-title">BPO Submitted Forms History</h2>

//         {loading ? (
//           <p className="loading-text">Loading...</p>
//         ) : historyForms.length === 0 ? (
//           <p className="no-data">No submitted forms found.</p>
//         ) : (
//           <div className="history-grid">
//             {historyForms.map((form) => (
//               <div
//                 key={form.id}
//                 className="history-card"
//                 onClick={() => setSelectedForm(form)}
//               >
//                 <div className="card-header">
//                   <h3>{form.vendorShopName}</h3>
//                   <span className={`status ${form.status?.toLowerCase()}`}>
//                     {form.status}
//                   </span>
//                 </div>

//                 <div className="card-body">
//                   <p><strong>Vendor:</strong> {form.vendorName}</p>
//                   <p><strong>Executive:</strong> {form.executiveName}</p>
//                   <p><strong>TeamLead:</strong> {form.teamleadName}</p>
//                   <p><strong>Vendor Review:</strong> {form.vendorReview}</p>
//                   <p><strong>Executive Review:</strong> {form.executiveReview}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ✅ Modal */}
//         {selectedForm && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <h3>{selectedForm.vendorShopName}</h3>

//               <p><strong>Vendor:</strong> {selectedForm.vendorName}</p>
//               <p><strong>Executive:</strong> {selectedForm.executiveName}</p>
//               <p><strong>Status:</strong> {selectedForm.status}</p>

//               <textarea
//                 placeholder="Enter reason to request manager..."
//                 value={bpoReason}
//                 onChange={(e) => setBpoReason(e.target.value)}
//                 rows={4}
//               />

//               <div className="modal-buttons">
//                 <button
//                   className="request-btn"
//                   onClick={handleRequestManager}
//                   disabled={submitting}
//                 >
//                   {submitting ? "Sending..." : "Request Manager"}
//                 </button>

//                 <button
//                   className="close-btn"
//                   onClick={() => setSelectedForm(null)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// }

// export default BpoHistory;

import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../components/common/Layout/MainLayout";
import { 
  FiSearch, 
  FiFilter, 
  FiClock, 
  FiUser, 
  FiBriefcase,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSend,
  FiEye,
  FiDownload,
  FiCalendar
} from "react-icons/fi";
import "./BpoHistory.css";

const BASE_URL = "https://mft-zwy7.onrender.com";

function BpoHistory() {
  const [historyForms, setHistoryForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [bpoReason, setBpoReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/bpo-request/history`,
        { withCredentials: true }
      );
      setHistoryForms(response.data);
      setFilteredForms(response.data);
    } catch (error) {
      console.error("History Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter forms based on search, status, and date
  useEffect(() => {
    let filtered = [...historyForms];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(form => 
        form.vendorShopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.executiveName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(form => 
        form.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Date filter (if you have date field)
    if (dateFilter && form.createdAt) {
      filtered = filtered.filter(form => 
        new Date(form.createdAt).toDateString() === new Date(dateFilter).toDateString()
      );
    }
    
    setFilteredForms(filtered);
  }, [searchTerm, statusFilter, dateFilter, historyForms]);

  const handleRequestManager = async () => {
    if (!bpoReason.trim()) {
      alert("Please enter reason for manager request");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.put(
        `${BASE_URL}/api/bpo-request/request/${selectedForm.id}`,
        { bpoReason },
        { withCredentials: true }
      );

      setHistoryForms((prev) =>
        prev.map((form) =>
          form.id === selectedForm.id ? response.data : form
        )
      );

      alert("Request sent to Manager successfully!");
      setSelectedForm(null);
      setBpoReason("");
    } catch (error) {
      console.error("Request Error:", error);
      alert("Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'interested': return <FiCheckCircle className="status-icon interested" />;
      case 'not_interested': return <FiXCircle className="status-icon not-interested" />;
      case 'pending': return <FiClock className="status-icon pending" />;
      default: return <FiAlertCircle className="status-icon default" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status?.toLowerCase() || 'default'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <MainLayout>
      <div className="bpo-history">
        {/* Header Section */}
        <div className="history-header">
          <div className="header-title">
            <button 
              className="back-btn" 
              onClick={() => navigate("/bpo-dashboard")}
              style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              ← Back to Dashboard
            </button>
            <h1>BPO Submission History</h1>
            <p>View and manage all your historical submissions ({historyForms.length} total)</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Global Search: Shop, Vendor, Executive..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="filter-select">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="interested">INTERESTED</option>
                <option value="not_interested">NOT INTERESTED</option>
                <option value="pending">PENDING</option>
              </select>
            </div>

            <div className="filter-date">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Content Section */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading history...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="empty-state">
            <FiMessageSquare className="empty-icon" />
            <h3>No forms found</h3>
            <p>No BPO submission history matches your criteria</p>
          </div>
        ) : (
          <div className="forms-grid">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="form-card"
                onClick={() => setSelectedForm(form)}
              >
                <div className="card-header">
                  <div className="shop-info">
                    <h3>{form.vendorShopName || "Unnamed Shop"}</h3>
                    <span className={getStatusClass(form.status)}>
                      {getStatusIcon(form.status)}
                      {form.status?.replace('_', ' ') || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <FiUser className="info-icon" />
                    <span className="info-value">{form.vendorName}</span>
                  </div>

                  <div className="info-row">
                    <FiBriefcase className="info-icon" />
                    <span className="info-value">{form.executiveName}</span>
                  </div>

                  <div className="card-footer">
                    <div className="team-info">
                      <span className="team-value">{form.areaName || "N/A"}</span>
                    </div>
                    <div className="view-details">
                      <FiEye className="view-icon" />
                      <span>Details / Request</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedForm && (
          <div className="modal-overlay" onClick={() => { setSelectedForm(null); setBpoReason(""); }}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <h2>{selectedForm.vendorShopName}</h2>
                  <span className={getStatusClass(selectedForm.status)}>
                    {getStatusIcon(selectedForm.status)}
                    {selectedForm.status}
                  </span>
                </div>
                <button className="modal-close" onClick={() => { setSelectedForm(null); setBpoReason(""); }}>×</button>
              </div>

              <div className="modal-body">
                {/* Information Sections (Synced with Dashboard) */}
                <div className="reviews-section">
                  <h4>🏢 Core Details</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Vendor Name</span>
                      <span className="detail-value">{selectedForm.vendorName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Contact</span>
                      <span className="detail-value">{selectedForm.contactNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Executive</span>
                      <span className="detail-value">{selectedForm.executiveName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Team Lead</span>
                      <span className="detail-value">{selectedForm.teamleadName}</span>
                    </div>
                  </div>
                </div>

                <div className="reviews-section">
                  <h4>📍 Location & Address</h4>
                  <div className="review-box">
                    <p>{selectedForm.doorNumber}, {selectedForm.streetName}, {selectedForm.areaName}, {selectedForm.state} - {selectedForm.pinCode}</p>
                    <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                      Mapped Location: {selectedForm.vendorLocation || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="reviews-section">
                  <h4>💬 Review History</h4>
                  {selectedForm.executiveReview && (
                    <div className="review-box">
                      <span className="review-box-label">Executive Review</span>
                      <p>{selectedForm.executiveReview}</p>
                    </div>
                  )}
                  {selectedForm.vendorReview && (
                    <div className="review-box">
                      <span className="review-box-label">Vendor Review</span>
                      <p>{selectedForm.vendorReview}</p>
                    </div>
                  )}
                </div>

                {/* Manager Request Section */}
                <div className="request-section">
                  <h4>⚠️ Request Manager for Resubmission</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
                    If this form needs to be re-edited and resubmitted, enter the reason clearly for manager approval.
                  </p>
                  <textarea
                    placeholder="e.g., Vendor changed contact number, address needs correction..."
                    value={bpoReason}
                    onChange={(e) => setBpoReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-request"
                  onClick={handleRequestManager}
                  disabled={submitting}
                >
                  <FiSend /> {submitting ? "Sending Request..." : "Submit to Manager"}
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => { setSelectedForm(null); setBpoReason(""); }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default BpoHistory;