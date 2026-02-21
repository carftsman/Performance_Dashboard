import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../components/common/Layout/MainLayout";
import "./BpoDashboard.css";

const BASE_URL = "https://mft-zwy7.onrender.com";

function BpoDashBoard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  
  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedFormForReview, setSelectedFormForReview] = useState(null);
  const [executiveReview, setExecutiveReview] = useState("");
  const [vendorReview, setVendorReview] = useState("");
  const [selectedAction, setSelectedAction] = useState("SOLVED");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

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

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!selectedFormForReview) return;
    
    // Validation
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
    setSelectedAction("SOLVED");
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(false);
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
                  onClick={() => handleViewDetails(form)}
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

                  {/* Review Button */}
                  <button 
                    className="review-btn"
                    onClick={(e) => handleOpenReviewModal(form, e)}
                  >
                    {Icons.review} Add Review
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* View Details Modal */}
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
                {(executiveReview || vendorReview) && (
                  <div className="review-preview">
                    <h4>Preview</h4>
                    <div className="preview-content">
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
      </div>
    </MainLayout>
  );
}

export default BpoDashBoard;