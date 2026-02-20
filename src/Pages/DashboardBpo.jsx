// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import MainLayout from "../components/common/Layout/MainLayout";
// import "./DashboardBpo.css";

// const BASE_URL = "https://mft-zwy7.onrender.com";

// function BpoDashBoard() {
//   const [forms, setForms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedForm, setSelectedForm] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Status");

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const fetchForms = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${BASE_URL}/api/bpo/forms`,
//          {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true 
//         }
//       );

//       console.log("API Success:", response.data);

//       setForms(response.data);
//       setError(null);

//     } catch (err) {
//       console.error("Axios Error:", err);

//       if (err.response) {
//         // Backend returned error
//         console.log("Backend error message:", err.response.data);
//         setError(`Server Error: ${err.response.status}`);
//       } else if (err.request) {
//         setError("No response from server");
//       } else {
//         setError(err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔍 Search + Filter
//   const filteredForms = forms.filter((form) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       form.vendorShopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       form.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       form.id?.toString().includes(searchTerm);

//     const matchesStatus =
//       statusFilter === "All Status" ||
//       form.status?.toLowerCase() === statusFilter.toLowerCase();

//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <MainLayout>
//       <div className="bpo-dashboard">
//         <div className="dashboard-header">
//           <div>
//             <h1>BPO Forms Management</h1>
//             <p>Total Forms: {forms.length}</p>
//           </div>
//           <button className="refresh-btn" onClick={fetchForms}>
//             Refresh
//           </button>
//         </div>

//         <div className="filter-bar">
//           <input
//             type="text"
//             placeholder="Search by Shop / Vendor / ID"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option>All Status</option>
//             <option>INTERESTED</option>
//             <option>NOT_INTERESTED</option>
//             <option>ONBOARDED</option>
//           </select>
//         </div>

//         {loading && <p>Loading forms...</p>}

//         {error && (
//           <div className="error-box">
//             <p>{error}</p>
//             <button onClick={fetchForms}>Retry</button>
//           </div>
//         )}

//         {!loading && !error && (
//           <div className="forms-grid">
//             {filteredForms.length === 0 ? (
//               <p>No forms found</p>
//             ) : (
//               filteredForms.map((form) => (
//                 <div
//                   key={form.id}
//                   className="form-card"
//                   onClick={() => setSelectedForm(form)}
//                 >
//                   <div className="card-header">
//                     <span>ID: #{form.id}</span>
//                     <span className={`status ${form.status}`}>
//                       {form.status}
//                     </span>
//                   </div>

//                   <h3>{form.vendorShopName}</h3>
//                   <p><strong>Owner:</strong> {form.vendorName}</p>
//                   <p><strong>Location:</strong> {form.vendorLocation}</p>
//                   <p><strong>Executive:</strong> {form.executiveName}</p>
//                   <p><strong>Team Lead:</strong> {form.teamleadName}</p>
//                   <p>
//                     <strong>Date:</strong>{" "}
//                     {new Date(form.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {selectedForm && (
//           <div className="modal-overlay" onClick={() => setSelectedForm(null)}>
//             <div
//               className="modal-content"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2>Form Details - #{selectedForm.id}</h2>

//               <p><strong>Shop:</strong> {selectedForm.vendorShopName}</p>
//               <p><strong>Owner:</strong> {selectedForm.vendorName}</p>
//               <p><strong>Contact:</strong> {selectedForm.contactNumber}</p>
//               <p><strong>Email:</strong> {selectedForm.mailId}</p>

//               <p>
//                 <strong>Address:</strong><br />
//                 {selectedForm.doorNumber}, {selectedForm.streetName},{" "}
//                 {selectedForm.areaName}, {selectedForm.state} -{" "}
//                 {selectedForm.pinCode}
//               </p>

//               <p><strong>Review:</strong> {selectedForm.review}</p>
//               <p><strong>Status:</strong> {selectedForm.status}</p>
//               <p><strong>Tag:</strong> {selectedForm.tag}</p>

//               <button onClick={() => setSelectedForm(null)}>Close</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// }

// export default BpoDashBoard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../components/common/Layout/MainLayout";
import "./DashboardBpo.css";

const BASE_URL = "https://mft-zwy7.onrender.com";

function BpoDashBoard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/bpo/forms`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true 
        }
      );

      console.log("API Success:", response.data);
      setForms(response.data);
      setError(null);
    } catch (err) {
      console.error("Axios Error:", err);

      if (err.response) {
        setError(`Server Error: ${err.response.status}`);
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: forms.length,
    interested: forms.filter(f => f.status === 'INTERESTED').length,
    onboarded: forms.filter(f => f.status === 'ONBOARDED').length,
    notInterested: forms.filter(f => f.status === 'NOT_INTERESTED').length
  };

  // Filter forms
  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      searchTerm === "" ||
      form.vendorShopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.id?.toString().includes(searchTerm) ||
      form.executiveName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      form.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Icons (using emoji as fallback, but you can replace with actual icon library)
  const Icons = {
    shop: "🏪",
    owner: "👤",
    location: "📍",
    executive: "👨‍💼",
    teamlead: "👥",
    calendar: "📅",
    phone: "📞",
    email: "✉️"
  };

  return (
    <MainLayout>
      <div className="bpo-dashboard">
        {/* Header with Stats */}
        <div className="dashboard-header">
          <div>
            <h1>BPO Forms Management</h1>
            <p>Manage and track all vendor forms</p>
          </div>
          <div className="header-stats">
            <span className="stat-badge">Total: {stats.total}</span>
            <span className="stat-badge">Interested: {stats.interested}</span>
            <span className="stat-badge">Onboarded: {stats.onboarded}</span>
          </div>
          <button className="refresh-btn" onClick={fetchForms}>
            ⟳ Refresh
          </button>
        </div>

        {/* Search and Filter */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="🔍 Search by Shop, Vendor, ID, or Executive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>INTERESTED</option>
            <option>NOT_INTERESTED</option>
            <option>ONBOARDED</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading forms...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={fetchForms}>
              Try Again
            </button>
          </div>
        )}

        {/* Forms Grid */}
        {!loading && !error && (
          <div className="forms-grid">
            {filteredForms.length === 0 ? (
              <div className="empty-state">
                <p>No forms found matching your criteria</p>
              </div>
            ) : (
              filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="form-card"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="card-header">
                    <span>#{form.id}</span>
                    <span className={`status ${form.status}`}>
                      {form.status}
                    </span>
                  </div>

                  <h3>{form.vendorShopName || "Unnamed Shop"}</h3>
                  
                  <div className="form-details">
                    <div className="detail-row">
                      <span className="detail-icon">{Icons.owner}</span>
                      <span className="detail-label">Owner:</span>
                      <span className="detail-value">{form.vendorName}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-icon">{Icons.location}</span>
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{form.vendorLocation}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-icon">{Icons.executive}</span>
                      <span className="detail-label">Executive:</span>
                      <span className="detail-value">{form.executiveName}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-icon">{Icons.teamlead}</span>
                      <span className="detail-label">Team Lead:</span>
                      <span className="detail-value">{form.teamleadName}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-icon">{Icons.calendar}</span>
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {new Date(form.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        {selectedForm && (
          <div className="modal-overlay" onClick={() => setSelectedForm(null)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Form Details #{selectedForm.id}</h2>
                <button className="close-btn" onClick={() => setSelectedForm(null)}>×</button>
              </div>

              <div className="modal-body">
                <div className="modal-field">
                  <span className="modal-label">Shop Information</span>
                  <div className="modal-value">
                    <strong>{selectedForm.vendorShopName}</strong>
                  </div>
                </div>

                <div className="modal-field">
                  <span className="modal-label">Owner Details</span>
                  <div className="modal-value">
                    {selectedForm.vendorName} | {selectedForm.contactNumber}
                  </div>
                </div>

                <div className="modal-field">
                  <span className="modal-label">Email</span>
                  <div className="modal-value">{selectedForm.mailId}</div>
                </div>

                <div className="modal-field">
                  <span className="modal-label">Complete Address</span>
                  <div className="address-block">
                    {selectedForm.doorNumber}, {selectedForm.streetName}<br />
                    {selectedForm.areaName}, {selectedForm.state}<br />
                    PIN: {selectedForm.pinCode}
                  </div>
                </div>

                <div className="modal-field">
                  <span className="modal-label">Review</span>
                  <div className="modal-value">{selectedForm.review}</div>
                </div>

                <div className="modal-field">
                  <span className="modal-label">Status</span>
                  <div className="modal-value">
                    <span className={`status ${selectedForm.status}`}>
                      {selectedForm.status}
                    </span>
                  </div>
                </div>

                {selectedForm.tag && (
                  <div className="modal-field">
                    <span className="modal-label">Tag</span>
                    <div className="modal-value">{selectedForm.tag}</div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button className="close-modal-btn" onClick={() => setSelectedForm(null)}>
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

export default BpoDashBoard;