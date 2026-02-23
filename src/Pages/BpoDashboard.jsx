import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../components/common/Layout/MainLayout";
import "./BpoDashboard.css";
import { useNavigate } from "react-router-dom";
const BASE_URL = "https://mft-zwy7.onrender.com";

function BpoDashBoard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [vendorTypeFilter, setVendorTypeFilter] = useState("All Types");
  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedFormForReview, setSelectedFormForReview] = useState(null);
  const [executiveReview, setExecutiveReview] = useState("");
  const [vendorReview, setVendorReview] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [bpoName, setBpoName] = useState("");
  const [selectedAction, setSelectedAction] = useState("SOLVED");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // ── Approved Requests Feature State ───────────────────────────────────────
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isFetchingApproved, setIsFetchingApproved] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);
  
  const navigate = useNavigate();
  useEffect(() => {
    fetchForms();
    fetchApprovedRequests();
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

  const fetchApprovedRequests = async () => {
    try {
      setIsFetchingApproved(true);
      const response = await axios.get(
        `${BASE_URL}/api/bpo-request/reopened`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true 
        }
      );
      console.log("fetch approved request response from bpoDashboard",response)

      setApprovedRequests(response.data || []);
    } catch (err) {
      console.error("Error fetching approved requests:", err);
    } finally {
      setIsFetchingApproved(false);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!selectedFormForReview) return;
    
    // Validation
    if (!idNumber.trim()) {
      setSubmitError("Please provide ID Number");
      return;
    }
    if (!bpoName.trim()) {
      setSubmitError("Please provide BPO Name");
      return;
    }
    if (!executiveReview.trim()) {
      setSubmitError("Please provide executive review");
      return;
    }
    if (!vendorReview.trim()) {
      setSubmitError("Please provide vendor review");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      const payload = {
        action: selectedAction,
        idNumber: idNumber.trim(),
        bpoName: bpoName.trim(),
        executiveReview: executiveReview.trim(),
        vendorReview: vendorReview.trim()
      };

      console.log("Submitting review:", payload);
      
      const response = await axios.post(
        `${BASE_URL}/api/bpo/submit/${selectedFormForReview.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      console.log("Review submitted successfully:", response.data);
      
      setSubmitSuccess("Review submitted successfully!");
      
      // Update the form in the list with new data
      setForms(prevForms => 
        prevForms.map(form => 
          form.id === selectedFormForReview.id ? response.data : form
        )
      );
      
     
    } catch (err) {
      console.error("Error submitting review:", err);
      setSubmitError(
        err.response?.data?.message || 
        "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open review modal
  const handleOpenReviewModal = (form, e)=> {
    e.stopPropagation(); // Prevent card click
    setSelectedFormForReview(form);
    setExecutiveReview("");
    setVendorReview("");
    setIdNumber("");
    setBpoName("");
    setSelectedAction("SOLVED");
    setSubmitError(null);
    setSubmitSuccess(null);
    setShowReviewModal(true);
  };

  // Close review modal
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedFormForReview(null);
    setExecutiveReview("");
    setVendorReview("");
    setIdNumber("");
    setBpoName("");
    setSelectedAction("SOLVED");
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(false);
  };

  // ── Approved Requests Handlers ────────────────────────────────────────────
  const handleEditRequest = (req) => {
    setEditingRequest(req);
    setEditFormData({
      vendorShopName: req.vendorShopName || "",
      vendorName: req.vendorName || "",
      contactNumber: req.contactNumber || "",
      mailId: req.mailId || "",
      vendorType: req.vendorType || "",
      doorNumber: req.doorNumber || "",
      streetName: req.streetName || "",
      areaName: req.areaName || "",
      pinCode: req.pinCode || "",
      state: req.state || "",
      vendorLocation: req.vendorLocation || "",
      latitude: req.latitude || "",
      longitude: req.longitude || "",
      idNumber: req.idNumber || "",
      bpoName: req.bpoName || "",
      executiveReview: req.executiveReview || "",
      vendorReview: req.vendorReview || "",
      action: req.action || "SOLVED"
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateAndResubmit = async () => {
    // Basic validation
    if (!editFormData.vendorShopName || !editFormData.vendorName || !editFormData.idNumber || !editFormData.bpoName || !editFormData.executiveReview || !editFormData.vendorReview) {
      alert("Please fill in all required fields (Shop Name, Owner Name, ID, BPO Name, and Reviews).");
      return;
    }

    try {
      setIsResubmitting(true);
      await axios.put(
        `${BASE_URL}/api/bpo-request/resubmit/${editingRequest.id}`,
        editFormData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );
      
      alert("BPO Request resubmitted successfully!");
      setEditingRequest(null);
      
      // Refresh data
      fetchApprovedRequests();
      fetchForms();
      
      // Auto-close if it was the last one
      if (approvedRequests.length <= 1) {
        setShowApprovedModal(false);
      }
    } catch (error) {
      console.error("Failed to resubmit request:", error);
      alert(error.response?.data?.message || "Failed to resubmit request. Please try again.");
    } finally {
      setIsResubmitting(false);
    }
  };

  // Open view details modal
  const handleViewDetails = (form) => {
    setSelectedForm(form);
  };

  // Calculate statistics
  const stats = {
    total: forms.length,
    interested: forms.filter(f => f.status === 'INTERESTED').length,
    onboarded: forms.filter(f => f.status === 'ONBOARDED').length,
    notInterested: forms.filter(f => f.status === 'NOT_INTERESTED').length
  };
  // Generate unique locations (Alphabetical Order)
const uniqueLocations = [
  ...new Set(
    forms
      .map(form => form.vendorLocation)
      .filter(location => location && location.trim() !== "")
  )
].sort((a, b) => a.localeCompare(b));

// Generate unique vendor types
const uniqueVendorTypes = [
  ...new Set(
    forms
      .map(form => form.vendorType)
      .filter(type => type && type.trim() !== "")
  )
].sort((a, b) => a.localeCompare(b));
  // Filter forms
  const filteredForms = forms.filter((form) => {
  const searchValue = searchTerm.toLowerCase();

  const matchesSearch =
    searchTerm === "" ||
    form.vendorShopName?.toLowerCase().includes(searchValue) ||
    form.vendorName?.toLowerCase().includes(searchValue) ||
    form.executiveName?.toLowerCase().includes(searchValue) ||
    form.vendorLocation?.toLowerCase().includes(searchValue) ||  // ✅ Added location here
    form.id?.toString().includes(searchTerm);

  const matchesStatus =
    statusFilter === "All Status" ||
    form.status?.toLowerCase() === statusFilter.toLowerCase();

  const matchesLocation =
    locationFilter === "All Locations" ||
    form.vendorLocation === locationFilter;
const matchesVendorType =
  vendorTypeFilter === "All Types" ||
  form.vendorType === vendorTypeFilter;
  return matchesSearch && matchesStatus && matchesLocation && matchesVendorType;
});

  // Icons
  const Icons = {
    shop: "🏪",
    owner: "👤",
    location: "📍",
    executive: "👨‍💼",
    teamlead: "👥",
    calendar: "📅",
    phone: "📞",
    email: "✉️",
    review: "✍️",
    submit: "📤"
  };

  return (
    <MainLayout>
      <div className="bpo-dashboard">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-title-group">
            <h1>BPO Performance Dashboard</h1>
            <p>Manage and review vendor submissions ({forms.length} total)</p>
          </div>

          <div className="header-actions">
            <button
              className="back-btn"
              onClick={() => navigate("/bpo-history")}
              style={{ marginRight: '8px' }}
            >
              📜 View History
            </button>
            {approvedRequests.length > 0 && (
              <div className="bpo-approved-badge-container">
                <button 
                  className="bpo-btn-ghost"
                  onClick={() => setShowApprovedModal(true)}
                >
                  📋 Approved Requests
                </button>
                <span className="bpo-badge-count">{approvedRequests.length}</span>
              </div>
            )}
            <button className="refresh-btn" onClick={() => { fetchForms(); fetchApprovedRequests(); }}>
              {Icons.refresh} Refresh
            </button>
          </div>
        </div>

        {/* Search and Filter */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <div className="search-icon">{Icons.search}</div>
          <input
            type="text"
            placeholder="Search by shop name, owner, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="INTERESTED">INTERESTED</option>
          <option value="NOT_INTERESTED">NOT INTERESTED</option>
          <option value="ONBOARDED">ONBOARDED</option>
          <option value="PENDING">PENDING</option>
        </select>

        <select
          className="filter-select"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="All Locations">All Locations</option>
          {uniqueLocations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={vendorTypeFilter}
          onChange={(e) => setVendorTypeFilter(e.target.value)}
        >
          <option value="All Types">All Types</option>
          {uniqueVendorTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
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
                  className="bpo-card-compact"
                  onClick={() => handleViewDetails(form)}
                >
                  <div className="card-top">
                    <div className="card-id">#{form.id}</div>
                    <span className={`status-badge status--${form.status?.toLowerCase().replace('_', '-')}`}>
                      {form.status?.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="card-title">{form.vendorShopName || "Unnamed Shop"}</h3>
                  <div className="card-subtitle">
                    <span>👤 {form.vendorName}</span>
                  </div>

                  <div className="card-meta">
                    <div className="meta-item">
                      <span>📍 {form.areaName || form.vendorLocation?.split(',')[0]}</span>
                    </div>
                    <div className="meta-item">
                      <span>📅 {new Date(form.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* View Details Modal */}
        {selectedForm && (
          <div className="bpo-modal-overlay" onClick={() => setSelectedForm(null)}>
            <div className="bpo-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="bpo-modal-header">
                <div className="modal-header-info">
                  <h2>{selectedForm.vendorShopName || "Unnamed Shop"}</h2>
                  <p>Form ID: #{selectedForm.id} • Submitted on {new Date(selectedForm.createdAt).toLocaleDateString()}</p>
                </div>
                <button className="bpo-modal-close" onClick={() => setSelectedForm(null)}>×</button>
              </div>

              <div className="bpo-modal-body">
                {/* Core Details Section */}
                <div className="detail-section">
                  <div className="detail-section-title">🏢 Core Vendor Details</div>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <label>Owner Name</label>
                      <div className="value">{selectedForm.vendorName}</div>
                    </div>
                    <div className="detail-field">
                      <label>Vendor Type</label>
                      <div className="value">{selectedForm.vendorType || "N/A"}</div>
                    </div>
                    <div className="detail-field">
                      <label>Contact Number</label>
                      <div className="value">{selectedForm.contactNumber}</div>
                    </div>
                    <div className="detail-field">
                      <label>Email Address</label>
                      <div className="value">{selectedForm.mailId || "N/A"}</div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="detail-section">
                  <div className="detail-section-title">📍 Address & Location</div>
                  <div className="detail-grid">
                    <div className="detail-field detail-field--full">
                      <label>Complete Address</label>
                      <div className="value">
                        {selectedForm.doorNumber}, {selectedForm.streetName}, {selectedForm.areaName}, {selectedForm.state} - {selectedForm.pinCode}
                      </div>
                    </div>
                    <div className="detail-field">
                      <label>Mapped Location</label>
                      <div className="value">{selectedForm.vendorLocation || "N/A"}</div>
                    </div>
                    <div className="detail-field">
                      <label>Coordinates (Lat/Long)</label>
                      <div className="value">
                        {selectedForm.latitude && selectedForm.longitude ? `${selectedForm.latitude}, ${selectedForm.longitude}` : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Section */}
                <div className="detail-section">
                  <div className="detail-section-title">👥 Assignment Hierarchy</div>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <label>Executive Name</label>
                      <div className="value">{selectedForm.executiveName}</div>
                    </div>
                    <div className="detail-field">
                      <label>Team Lead</label>
                      <div className="value">{selectedForm.teamleadName}</div>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="detail-section">
                  <div className="detail-section-title">📊 Status & Tags</div>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <label>Current Status</label>
                      <div className="value">
                        <span className={`status-badge status--${selectedForm.status?.toLowerCase().replace('_', '-')}`}>
                          {selectedForm.status}
                        </span>
                      </div>
                    </div>
                    <div className="detail-field">
                      <label>Priority Tag</label>
                      <div className="value">{selectedForm.tag || "NONE"}</div>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                {(selectedForm.executiveReview || selectedForm.vendorReview || selectedForm.review) && (
                  <div className="detail-section">
                    <div className="detail-section-title">💬 Review History</div>
                    <div className="detail-grid">
                      {selectedForm.executiveReview && (
                        <div className="detail-field detail-field--full">
                          <div className="review-card">
                            <span className="author">Executive Review</span>
                            <p>"{selectedForm.executiveReview}"</p>
                          </div>
                        </div>
                      )}
                      {selectedForm.vendorReview && (
                        <div className="detail-field detail-field--full">
                          <div className="review-card">
                            <span className="author">Vendor Review</span>
                            <p>"{selectedForm.vendorReview}"</p>
                          </div>
                        </div>
                      )}
                      {selectedForm.review && (
                        <div className="detail-field detail-field--full">
                          <div className="review-card">
                            <span className="author">Manager/BPO Comments</span>
                            <p>"{selectedForm.review}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bpo-modal-footer">
                <button 
                  className="bpo-btn-primary"
                  onClick={(e) => {
                    setSelectedForm(null);
                    handleOpenReviewModal(selectedForm, e);
                  }}
                >
                  ✎ Add Manual Review
                </button>
                <button className="bpo-btn-ghost" onClick={() => setSelectedForm(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedFormForReview && (
          <div className="modal-overlay" onClick={handleCloseReviewModal}>
            <div
              className="modal-content review-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h2>Submit Review</h2>
                  <p className="modal-subtitle">
                    Form #{selectedFormForReview.id} - {selectedFormForReview.vendorShopName}
                  </p>
                   <div className="executive-info-badge">
      <span className="executive-label">Executive:</span>
      <span className="executive-name">{selectedFormForReview.executiveName || 'Not Assigned'}</span>
    </div>
                </div>
                <button className="close-btn" onClick={handleCloseReviewModal}>×</button>
              </div>

              <div className="modal-body">
                {/* Form Info Summary */}
                <div className="form-info-summary">
                  <div className="info-chip">
                    <span className="info-label">Vendor:</span>
                    <span className="info-value">{selectedFormForReview.vendorName}</span>
                  </div>
                  <div className="info-chip">
                    <span className="info-label">Contact:</span>
                    <span className="info-value">{selectedFormForReview.contactNumber}</span>
                  </div>
                  <div className="info-chip">
                    <span className="info-label">Current Status:</span>
                    <span className={`status ${selectedFormForReview.status}`}>
                      {selectedFormForReview.status}
                    </span>
                  </div>
                </div>
                 
                 

                {/* Success Message */}
                {submitSuccess && (
                  <div className="alert alert-success">
                    <span className="alert-icon">✅</span>
                    {submitSuccess}
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="alert alert-error">
                    <span className="alert-icon">⚠️</span>
                    {submitError}
                  </div>
                )}

                {/* ID Number */}
                <div className="form-group">
                  <label className="form-label">
                    ID Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="filter-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="Enter ID Number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* BPO Name */}
                <div className="form-group">
                  <label className="form-label">
                    BPO Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="filter-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="Enter BPO Name"
                    value={bpoName}
                    onChange={(e) => setBpoName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Executive Review */}
                <div className="form-group">
                  <label className="form-label">
                    Executive Review <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Write your review about the executive's performance..."
                    value={executiveReview}
                    onChange={(e) => setExecutiveReview(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="character-count">
                    {executiveReview.length} characters
                  </div>
                </div>

                {/* Vendor Review */}
                <div className="form-group">
                  <label className="form-label">
                    Vendor Review <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Write the vendor's feedback and response..."
                    value={vendorReview}
                    onChange={(e) => setVendorReview(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="character-count">
                    {vendorReview.length} characters
                  </div>
                </div>
                   {/* Action Selection */}
                <div className="form-group">
                  <label className="form-label">
                    Action <span className="required">*</span>
                  </label>
                  <div className="action-buttons">
                    {["SOLVED","NOT SOLVED"].map((action) => (
                      <button
                        key={action}
                        type="button"
                        className={`action-btn ${selectedAction === action ? 'active' : ''}`}
                        onClick={() => setSelectedAction(action)}
                        disabled={isSubmitting}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Section */}
                {(idNumber || bpoName || executiveReview || vendorReview) && (
                  <div className="review-preview">
                    <h4>Preview</h4>
                    <div className="preview-content">
                      {idNumber && (
                        <div className="preview-item">
                          <strong>ID Number:</strong>
                          <p>{idNumber}</p>
                        </div>
                      )}
                      {bpoName && (
                        <div className="preview-item">
                          <strong>BPO Name:</strong>
                          <p>{bpoName}</p>
                        </div>
                      )}
                      {executiveReview && (
                        <div className="preview-item">
                          <strong>Executive Review:</strong>
                          <p>{executiveReview}</p>
                        </div>
                      )}
                      {vendorReview && (
                        <div className="preview-item">
                          <strong>Vendor Review:</strong>
                          <p>{vendorReview}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions review-actions">
                <button 
                  className="btn-secondary"
                  onClick={handleCloseReviewModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary submit-btn"
                  onClick={handleReviewSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      {Icons.submit} Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 1: APPROVED REQUESTS LIST ── */}
        {showApprovedModal && (
          <div className="bpo-modal-overlay" onClick={() => setShowApprovedModal(false)}>
            <div className="bpo-modal" onClick={(e) => e.stopPropagation()}>
              <div className="bpo-modal-header">
                <h3 className="bpo-modal-title">Approved Requests ({approvedRequests.length})</h3>
                <button className="bpo-modal-close" onClick={() => setShowApprovedModal(false)}>×</button>
              </div>
              
              <div className="bpo-modal-body bg-slate-50">
                {isFetchingApproved ? (
                  <div className="bpo-empty-state">
                    <div className="loading-spinner"></div>
                    <p>Loading approved requests...</p>
                  </div>
                ) : approvedRequests.length === 0 ? (
                  <div className="bpo-empty-state">
                    <span className="bpo-empty-state-icon">✅</span>
                    <p className="bpo-empty-state-title">All caught up!</p>
                    <p className="bpo-empty-state-sub">You have no forms waiting for resubmission.</p>
                  </div>
                ) : (
                  <div className="bpo-approved-grid">
                    {approvedRequests.map(req => (
                      <div key={req.id} className="bpo-card">
                        <div className="bpo-card-header">
                          <span className="bpo-card-id">#{req.id}</span>
                          <span className="bpo-badge bpo-badge--followup">Needs Edit</span>
                        </div>
                        <h3 className="bpo-card-shop">🏪 {req.vendorShopName || 'Unnamed Shop'}</h3>
                        <div className="bpo-approved-reasons">
                          <div className="reason-block">
                            <strong>Original Request:</strong>
                            <p>{req.resendReason || "N/A"}</p>
                          </div>
                          <div className="reason-block">
                            <strong>Manager Review:</strong>
                            <p>{req.review || "N/A"}</p>
                          </div>
                        </div>
                        <div className="bpo-card-footer">
                          <span>📅 {new Date(req.createdAt).toLocaleDateString()}</span>
                          <button 
                            className="bpo-btn bpo-btn--primary"
                            onClick={() => handleEditRequest(req)}
                          >
                            ✎ Edit & Resubmit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 2: EDIT & RESUBMIT FORM ── */}
        {editingRequest && editFormData && (
          <div className="bpo-modal-overlay bpo-modal-overlay--edit" onClick={() => setEditingRequest(null)}>
            <div className="bpo-modal bpo-modal--large" onClick={(e) => e.stopPropagation()}>
              <div className="bpo-modal-header">
                <div className="bpo-modal-header-titles">
                  <h3 className="bpo-modal-title">Edit BPO Data</h3>
                  <span className="bpo-modal-subtitle">#{editingRequest.id} — Manager Feedback: {editingRequest.resendReason || "N/A"}</span>
                </div>
                <button 
                  className="bpo-modal-close" 
                  onClick={() => setEditingRequest(null)}
                  disabled={isResubmitting}
                >
                  ×
                </button>
              </div>

              <div className="bpo-modal-body">
                <div className="bpo-edit-form">
                  <div className="bpo-edit-section">
                    <h4>Core Vendor Details</h4>
                    <div className="bpo-edit-grid">
                      <div className="bpo-form-group">
                        <label>Shop Name*</label>
                        <input name="vendorShopName" value={editFormData.vendorShopName} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>Owner Name*</label>
                        <input name="vendorName" value={editFormData.vendorName} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>Contact Number</label>
                        <input name="contactNumber" value={editFormData.contactNumber} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>Email Address</label>
                        <input name="mailId" value={editFormData.mailId} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>Vendor Type</label>
                        <input name="vendorType" value={editFormData.vendorType} onChange={handleEditChange} />
                      </div>
                    </div>
                  </div>

                  <div className="bpo-edit-section">
                    <h4>Address Information</h4>
                    <div className="bpo-edit-grid">
                      <div className="bpo-form-group">
                        <label>Door Number</label>
                        <input name="doorNumber" value={editFormData.doorNumber} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>Street Name</label>
                        <input name="streetName" value={editFormData.streetName} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>Area Name</label>
                        <input name="areaName" value={editFormData.areaName} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>PIN Code</label>
                        <input name="pinCode" value={editFormData.pinCode} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>State</label>
                        <input name="state" value={editFormData.state} onChange={handleEditChange} />
                      </div>
                    </div>
                  </div>

                  <div className="bpo-edit-section">
                    <h4>Location Metadata</h4>
                    <div className="bpo-edit-grid">
                      <div className="bpo-form-group">
                        <label>Latitude</label>
                        <input name="latitude" value={editFormData.latitude} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>Longitude</label>
                        <input name="longitude" value={editFormData.longitude} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>Mapped Location (Coordinates)</label>
                        <input name="vendorLocation" value={editFormData.vendorLocation} onChange={handleEditChange} />
                      </div>
                    </div>
                  </div>

                  <div className="bpo-edit-section">
                    <h4>BPO Review Details</h4>
                    <div className="bpo-edit-grid">
                      <div className="bpo-form-group">
                        <label>ID Number*</label>
                        <input name="idNumber" value={editFormData.idNumber} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>BPO Name*</label>
                        <input name="bpoName" value={editFormData.bpoName} onChange={handleEditChange} />
                      </div>
                      <div className="bpo-form-group">
                        <label>Action</label>
                        <select name="action" value={editFormData.action} onChange={handleEditChange} className="form-select bpo-action-select">
                          <option value="SOLVED">SOLVED</option>
                          <option value="NOT SOLVED">NOT SOLVED</option>
                        </select>
                      </div>
                    </div>
                    <div className="bpo-edit-grid bpo-edit-grid--full" style={{marginTop: '16px'}}>
                      <div className="bpo-form-group bpo-form-group--full">
                        <label>Executive Review*</label>
                        <textarea 
                          name="executiveReview" 
                          value={editFormData.executiveReview} 
                          onChange={handleEditChange}
                          rows="3"
                        />
                      </div>
                      <div className="bpo-form-group bpo-form-group--full">
                        <label>Vendor Review*</label>
                        <textarea 
                          name="vendorReview" 
                          value={editFormData.vendorReview} 
                          onChange={handleEditChange}
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bpo-modal-footer bpo-modal-footer--actions">
                <button 
                  className="bpo-btn bpo-btn--secondary"
                  onClick={() => setEditingRequest(null)}
                  disabled={isResubmitting}
                >
                  Cancel
                </button>
                <button 
                  className="bpo-btn bpo-btn--success"
                  onClick={handleUpdateAndResubmit}
                  disabled={isResubmitting}
                >
                  {isResubmitting ? "Resubmitting..." : "Resubmit BPO Data"}
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