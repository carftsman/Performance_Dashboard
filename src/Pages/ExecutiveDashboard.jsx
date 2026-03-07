




import React, { useEffect, useState } from "react";
import VendorForm from "../components/Executive/VendorForm";
import { formService } from "../Services/form.service";
import { executiveService } from "../Services/executive.service";
import "./ExecutiveDashboard.css";
import {toast } from "react-toastify";
import UniformNavbar from "../components/common/Navbar/UniformNavbar";

const ExecutiveDashboard = ({ user, logout }) => {

  // const [locationAllowed, setLocationAllowed] = useState(false);
  const [workStarted, setWorkStarted] = useState(false);

  const [workStartLocation, setWorkStartLocation] = useState(null);
  const [vendorLocation, setVendorLocation] = useState(null);

  const [geocodedAddress, setGeocodedAddress] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [selectedForm, setSelectedForm] = useState(null);

  // ── Request Manager Modal state ───────────────────────────────────────────
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestReason, setRequestReason] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  // ── Approved Requests state ───────────────────────────────────────────────
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isResubmitting, setIsResubmitting] = useState(false);

  // ── Attendance states ─────────────────────────────────────────────────────
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [checkingAttendance, setCheckingAttendance] = useState(true);

  // ── Search state ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");

  // ── In Review screen state ────────────────────────────────────────────────
  const [showInReviewScreen, setShowInReviewScreen] = useState(false);
  const [inReviewForms, setInReviewForms] = useState([]);
  const [loadingInReview, setLoadingInReview] = useState(false);
  const [selectedInReviewForm, setSelectedInReviewForm] = useState(null);

  if (!user) return <h2>No User Found. Please Login Again.</h2>;

  /* =========================================
     LOAD HISTORY (RESTORED)
  ========================================== */
  useEffect(() => {
    checkAttendanceStatus();
    loadHistory();
  }, []);

  const checkAttendanceStatus = async () => {
    try {
      const response = await executiveService.checkAttendance();
      if (response === true) {
        setAttendanceMarked(true);
        setWorkStarted(true);
      }
    } catch (error) {
      console.error("Attendance check failed:", error);
    } finally {
      setCheckingAttendance(false);
    }
  };
  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await formService.getMyHistory();
      setHistory(data || []);
    } catch (error) {
      console.error("History load error:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadApprovedRequests = async () => {
    try {
      const response = await executiveService.getApprovedRequests();
      setApprovedRequests(response || []);
    } catch (error) {
      console.error("Failed to load approved requests:", error);
    }
  };

  /* =========================================
     ENABLE LOCATION
  ========================================== */
  const handleEnableLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const payload = {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          };
          await executiveService.markAttendance(payload);
          setAttendanceMarked(true);
          toast.success("Attendance Marked Successfully ✅");
        } catch (error) {
          console.error("Attendance marking failed:", error);
          toast.error("Failed to mark attendance");
        }
      },
      () => toast.error("Location Permission Denied ❌")
    );
  };

  /* =========================================
     START WORK (Store once)
  ========================================== */
  const handleStartWork = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const startLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };

        setWorkStartLocation(startLocation);
        setWorkStarted(true);
        setShowForm(true);
      },
      () => toast.error("Unable to fetch start location")
    );
  };

  /* =========================================
     CAPTURE VENDOR LOCATION + AUTOFILL
  ========================================== */
  const captureVendorLocation = () => {

    setIsGettingLocation(true);
    setVendorLocation(null);
    setGeocodedAddress(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const { latitude, longitude } = position.coords;

        const visitLocation = {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        };

        setVendorLocation(visitLocation);

        try {
          const apiKey = "AIzaSyAt59NjjnVtI5PfvhkQKFDLeBFfCTW-mxg";
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

          const res = await fetch(url);
          const data = await res.json();
 
          if (data.status === "OK") {

            const result = data.results[0];
            const components = result.address_components;

            const getComponent = (type) =>
              components.find((c) => c.types.includes(type))?.long_name || "";

            const address = {
              streetName: result.formatted_address || "",
              areaName: getComponent("sublocality") || getComponent("locality"),
              pinCode: getComponent("postal_code"),
              state: getComponent("administrative_area_level_1"),
              district: getComponent("administrative_area_level_2") || getComponent("administrative_area_level_3"),
            };

            setGeocodedAddress(address);
          }

        } catch (error) {
          console.error("Reverse geocode failed");
        }

        setIsGettingLocation(false);
      },
      () => {
        toast.error("Unable to capture vendor location");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  }

  /* =========================================
     SUBMIT FORM
  ========================================== */
  const handleSubmitDailyLog = async (formData) => {
    if (!vendorLocation) {
      toast.warning("Please capture vendor location");
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        // ✅ Backend expects flat latitude & longitude
        latitude: vendorLocation.latitude,
        longitude: vendorLocation.longitude,

        // ✅ Backend expects vendorLocation as STRING (using areaName or formatted address)
        vendorLocation:
          geocodedAddress?.areaName ||
          geocodedAddress?.streetName ||
          "Current Location",
      };
      

      await formService.createForm(submissionData);

      toast.success("Form submitted successfully!");

      setVendorLocation(null);
      setGeocodedAddress(null);
      setShowForm(false);

      loadHistory(); // refresh history

    } catch (error) {
      console.error("Submission failed:", error.response?.data);
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Request to Manager Handler ────────────────────────────────────────────
  const handleProceedRequest = async () => {
    if (!requestReason.trim()) {
      toast.warning("Please enter a reason for the request.");
      return;
    }

    try {
      setIsRequesting(true);
      const payload = {
        formId: selectedForm.id,
        reason: requestReason.trim(),
      };
      await formService.resendRequest(payload);
      toast.success("Request sent successfully to the manager.");
      // Reset request modal state
      setShowRequestModal(false);
      setRequestReason("");
      // Close the detail modal
      setSelectedForm(null);
    } catch (err) {
      console.error("Failed to send request:", err);
      toast.error("Failed to send request. Please try again later.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCancelRequest = () => {
    setShowRequestModal(false);
    setRequestReason("");
  };

  // ── In Review Handlers ──────────────────────────────────────────────────
  const handleOpenInReview = async () => {
    setShowInReviewScreen(true);
    // Lazy-load: fetch only when screen is opened for the first time or re-opened
    setLoadingInReview(true);
    try {
      const data = await executiveService.getSolvedForms();
      setInReviewForms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load in-review forms:", error);
      toast.error("Failed to load In Review forms.");
      setInReviewForms([]);
    } finally {
      setLoadingInReview(false);
    }
  };

  const handleCloseInReview = () => {
    setShowInReviewScreen(false);
    setSelectedInReviewForm(null);
  };

  // ── Approved Requests Handlers ────────────────────────────────────────────
  const handleEditRequest = (req) => {
    setEditingRequest(req);
    // Pre-fill the form data for editing
    setEditFormData({
      vendorShopName: req.vendorShopName || "",
      vendorName: req.vendorName || "",
      contactNumber: req.contactNumber || "",
      mailId: req.mailId || "",
      vendorType: req.vendorType || "RESTAURANT",
   
      vendorLocation: req.vendorLocation || "",
      doorNumber: req.doorNumber || "",
      streetName: req.streetName || "",
      areaName: req.areaName || "",
      pinCode: req.pinCode || "",
      state: req.state || "",
      district: req.district || "",
      status: req.status || "INTERESTED",
      review: req.review || "",
      latitude: req.latitude || 0,
      longitude: req.longitude || 0,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateAndResubmit = async () => {
    if (!editFormData.vendorShopName || !editFormData.vendorName || !editFormData.district) {
      toast.warning("Vendor Shop Name, Vendor Name, and District are required.");
      return;
    }

    try {
      setIsResubmitting(true);
      await executiveService.resubmitRequest(editingRequest.id, editFormData);
      toast.success("Request resubmitted successfully!");
      setEditingRequest(null);
      
      // Refresh data
      await loadApprovedRequests();
      await loadHistory();
      
      // Auto-close if it was the last one
      if (approvedRequests.length <= 1) {
        setShowApprovedModal(false);
      }
    } catch (error) {
      console.error("Failed to resubmit:", error);
      toast.error("Failed to resubmit request. Please try again.");
    } finally {
      setIsResubmitting(false);
    }
  };

  /* =========================================
     DERIVED: Filtered history for search
  ========================================== */
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredHistory = trimmedQuery
    ? history.filter((form) => {
        return (
          form.vendorShopName?.toLowerCase().includes(trimmedQuery) ||
          form.vendorName?.toLowerCase().includes(trimmedQuery) ||
          form.areaName?.toLowerCase().includes(trimmedQuery) ||
          form.state?.toLowerCase().includes(trimmedQuery) ||
          form.status?.toLowerCase().includes(trimmedQuery) ||
          form.contactNumber?.includes(trimmedQuery) ||
          form.teamleadName?.toLowerCase().includes(trimmedQuery) ||
          String(form.id).includes(trimmedQuery)
        );
      })
    : history;

  /* =========================================
     HELPERS
  ========================================== */
  const getStatusBadgeClass = (status) => {
    if (status === "INTERESTED") return "exec-badge exec-badge--interested";
    if (status === "NOT_INTERESTED") return "exec-badge exec-badge--not-interested";
    if (status === "FOLLOW_UP") return "exec-badge exec-badge--followup";
    return "exec-badge exec-badge--default";
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };

  /* =========================================
     RENDER
  ========================================== */
  return (
    <div className="exec-page">
      <UniformNavbar
        user={user}
        role="Field Executive"
        locationAllowed={attendanceMarked}
        workStarted={workStarted}
        loading={loadingHistory}
        showForm={showForm}
        onRefresh={() => {
          loadHistory();
          loadApprovedRequests();
        }}
        onEnableLocation={handleEnableLocation}
        onStartWork={handleStartWork}
        onAddEntry={() => setShowForm(true)}
        logout={logout}
        approvedRequestsCount={approvedRequests.length}
        onShowApprovedRequests={() => setShowApprovedModal(true)}
        onShowInReview={handleOpenInReview}
      />

      {/* ── STATUS BAR ── */}
      <div className="exec-status-bar">
        <span>Status:</span>
        {workStarted ? (
          <span className="exec-status-pill exec-status-pill--active">
            <span className="exec-status-dot" />
            Work In Progress
          </span>
        ) : attendanceMarked ? (
          <span className="exec-status-pill exec-status-pill--inactive">
            <span className="exec-status-dot" />
            Attendance Marked — Start Work
          </span>
        ) : checkingAttendance ? (
          <span className="exec-status-pill exec-status-pill--inactive">
            <span className="exec-status-dot" />
            Checking status...
          </span>
        ) : (
          <span className="exec-status-pill exec-status-pill--inactive">
            <span className="exec-status-dot" />
            Enable Location to Get Started
          </span>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="exec-main">

        {/* ── VENDOR FORM ── */}
        {showForm && (
          <div className="exec-form-wrapper">
            <div className="exec-form-header">
              <h2 className="exec-form-title">
                📝 New Vendor Entry
              </h2>
              <button
                className="exec-btn--back"
                onClick={() => setShowForm(false)}
              >
                ← Back to History
              </button>
            </div>
            <VendorForm
              onSubmit={handleSubmitDailyLog}
              locationCaptured={!!vendorLocation}
              onGetLocation={captureVendorLocation}
              isGettingLocation={isGettingLocation}
              isSubmitting={isSubmitting}
              geocodedAddress={geocodedAddress}
              onBack={() => setShowForm(false)}
            />
          </div>
        )}

        {/* ── IN REVIEW SCREEN ── */}
        {showInReviewScreen && !showForm && (
          <section className="exec-history-section">
            <div className="exec-history-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button className="exec-btn--back" onClick={handleCloseInReview}>
                  ← Back
                </button>
                <h2 className="exec-history-title">
                  🕐 In Review
                  {!loadingInReview && (
                    <span className="exec-history-count">{inReviewForms.length}</span>
                  )}
                </h2>
              </div>
            </div>

            {loadingInReview ? (
              <div className="exec-loading">
                <span className="exec-spinner" />
                Loading forms…
              </div>
            ) : inReviewForms.length === 0 ? (
              <div className="exec-empty-state">
                <span className="exec-empty-state-icon">📭</span>
                <p className="exec-empty-state-title">No forms in review</p>
                <p className="exec-empty-state-sub">There are currently no solved forms to display.</p>
              </div>
            ) : (
              <div className="exec-cards-grid">
                {inReviewForms.map((form) => (
                  <div
                    key={form.id}
                    className="exec-card exec-card--clickable"
                    onClick={() => setSelectedInReviewForm(form)}
                  >
                    <div className="exec-card-header">
                      <span className="exec-card-id">#{form.id}</span>
                      <span className={getStatusBadgeClass(form.status)}>
                        {form.status?.replace(/_/g, " ") || "—"}
                      </span>
                    </div>

                    <h3 className="exec-card-shop">
                      🏪 {form.vendorShopName || "Unnamed Shop"}
                    </h3>

                    <div className="exec-card-body">
                      <div className="exec-card-row">
                        <span className="exec-card-row-icon">👤</span>
                        <span className="exec-card-truncate">
                          {form.vendorName || "—"}
                        </span>
                      </div>
                      <div className="exec-card-row">
                        <span className="exec-card-row-icon">📍</span>
                        <span className="exec-card-truncate">
                          {[form.areaName, form.district, form.state].filter(Boolean).join(", ") || "—"}
                        </span>
                      </div>
                      {form.vendorType && (
                        <div className="exec-card-row">
                          <span className="exec-card-row-icon">🏷️</span>
                          <span className="exec-card-truncate">{form.vendorType}</span>
                        </div>
                      )}
                    </div>

                    <div className="exec-card-footer">
                      <span>📅 {formatDate(form.createdAt)}</span>
                      <span className="exec-card-action-text">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── HISTORY SECTION ── */}
        {!showForm && !showInReviewScreen && (
          <section className="exec-history-section">
            <div className="exec-history-header">
              <h2 className="exec-history-title">
                Submission History
                {!loadingHistory && (
                  <span className="exec-history-count">
                    {filteredHistory.length}
                    {trimmedQuery && ` of ${history.length}`}
                  </span>
                )}
              </h2>

              {/* Search */}
              {history.length > 0 && (
                <div className="exec-search-wrapper">
                  <span className="exec-search-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </span>
                  <input
                    className="exec-search-input"
                    type="text"
                    placeholder="Search by shop, vendor, area, status…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search history"
                  />
                  {searchQuery && (
                    <button
                      className="exec-search-clear"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Loading */}
            {loadingHistory ? (
              <div className="exec-loading">
                <span className="exec-spinner" />
                Loading history…
              </div>
            ) : history.length === 0 ? (
              /* Empty — no data at all */
              <div className="exec-empty-state">
                <span className="exec-empty-state-icon">📋</span>
                <p className="exec-empty-state-title">No submissions yet</p>
                <p className="exec-empty-state-sub">
                  {workStarted
                    ? "Click \"+ New Entry\" to log your first vendor visit."
                    : "Start work to begin logging vendor visits."}
                </p>
              </div>
            ) : filteredHistory.length === 0 ? (
              /* Empty — search with no results */
              <div className="exec-empty-state">
                <span className="exec-empty-state-icon">🔍</span>
                <p className="exec-empty-state-title">No results found</p>
                <p className="exec-empty-state-sub">
                  No records match "<strong>{searchQuery}</strong>". Try a different keyword.
                </p>
              </div>
            ) : (
              /* Compact Cards grid */
              <div className="exec-cards-grid">
                {filteredHistory.map((form) => (
                  <div 
                    key={form.id} 
                    className="exec-card exec-card--clickable"
                    onClick={() => setSelectedForm(form)}
                  >
                    <div className="exec-card-header">
                      <span className="exec-card-id">#{form.id}</span>
                      <span className={getStatusBadgeClass(form.status)}>
                        {form.status?.replace(/_/g, " ") || "—"}
                      </span>
                    </div>

                    <h3 className="exec-card-shop">
                      🏪 {form.vendorShopName || "Unnamed Shop"}
                    </h3>

                    <div className="exec-card-body">
                      <div className="exec-card-row">
                        <span className="exec-card-row-icon">📍</span>
                        <span className="exec-card-truncate">
                          {[form.areaName, form.state].filter(Boolean).join(", ") || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="exec-card-footer">
                      <span>📅 {formatDate(form.createdAt)}</span>
                      <span className="exec-card-action-text">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </main>

      {/* ── DETAIL MODAL ── */}
      {selectedForm && (
        <div className="exec-modal-overlay" onClick={() => setSelectedForm(null)}>
          <div className="exec-modal" onClick={(e) => e.stopPropagation()}>
            <div className="exec-modal-header">
              <h3 className="exec-modal-title">Vendor Visit Details</h3>
              <button 
                className="exec-modal-close" 
                onClick={() => setSelectedForm(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="exec-modal-body">
              {/* Top Banner */}
              <div className="exec-modal-banner">
                <div className="exec-modal-banner-main">
                  <h4>{selectedForm.vendorShopName || "Unnamed Shop"}</h4>
                  <span className="exec-modal-id">#{selectedForm.id}</span>
                </div>
                <span className={getStatusBadgeClass(selectedForm.status)}>
                  {selectedForm.status?.replace(/_/g, " ") || "—"}
                </span>
              </div>

              {/* Grid Details */}
              <div className="exec-modal-grid">
                <div className="exec-modal-field">
                  <label>Owner Name</label>
                  <p>{selectedForm.vendorName || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Contact Number</label>
                  <p>{selectedForm.contactNumber || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Email ID</label>
                  <p>{selectedForm.mailId || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Visit Date</label>
                  <p>{formatDate(selectedForm.createdAt)}</p>
                </div>
              </div>

              {/* divider */}
              <div className="exec-modal-divider" />

              <div className="exec-modal-grid">
                <div className="exec-modal-field exec-modal-field--full">
                  <label>Full Address</label>
                  <p>
                    {[ 
                      selectedForm.streetName, 
                      // selectedForm.areaName, 
                      // selectedForm.state,
                       selectedForm.district,
                      selectedForm.pinCode
                    ].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>

                <div className="exec-modal-field">
                  <label>Team Lead</label>
                  <p>{selectedForm.teamleadName || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Tag</label>
                  <p>
                    {selectedForm.tag ? (
                      <span className={`exec-badge ${selectedForm.tag === "YELLOW" ? "exec-badge--yellow" : "exec-badge--default"}`}>
                        {selectedForm.tag}
                      </span>
                    ) : "—"}
                  </p>
                </div>
              </div>

              {selectedForm.review && (
                <>
                  <div className="exec-modal-divider" />
                  <div className="exec-modal-field exec-modal-field--full">
                    <label>Review / Comments</label>
                    <div className="exec-card-review">
                      "{selectedForm.review}"
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="exec-modal-footer">
              <button 
                className="exec-btn exec-btn--request"
                onClick={() => setShowRequestModal(true)}
              >
                📤 Request to Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── IN REVIEW DETAIL MODAL ── */}
      {selectedInReviewForm && (
        <div className="exec-modal-overlay" onClick={() => setSelectedInReviewForm(null)}>
          <div className="exec-modal exec-modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="exec-modal-header">
              <h3 className="exec-modal-title">🕐 In Review — Form Details</h3>
              <button
                className="exec-modal-close"
                onClick={() => setSelectedInReviewForm(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="exec-modal-body">
              {/* Top Banner */}
              <div className="exec-modal-banner">
                <div className="exec-modal-banner-main">
                  <h4>{selectedInReviewForm.vendorShopName || "Unnamed Shop"}</h4>
                  <span className="exec-modal-id">#{selectedInReviewForm.id}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span className={getStatusBadgeClass(selectedInReviewForm.status)}>
                    {selectedInReviewForm.status?.replace(/_/g, " ") || "—"}
                  </span>
                  {selectedInReviewForm.tag && (
                    <span className={`exec-badge ${
                      selectedInReviewForm.tag === "GREEN"
                        ? "exec-badge--interested"
                        : selectedInReviewForm.tag === "RED"
                        ? "exec-badge--not-interested"
                        : selectedInReviewForm.tag === "YELLOW"
                        ? "exec-badge--yellow"
                        : "exec-badge--default"
                    }`}>
                      {selectedInReviewForm.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Group 1: Vendor Info */}
              <div className="exec-modal-grid">
                <div className="exec-modal-field">
                  <label>Owner Name</label>
                  <p>{selectedInReviewForm.vendorName || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Contact Number</label>
                  <p>{selectedInReviewForm.contactNumber || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Email ID</label>
                  <p>{selectedInReviewForm.mailId || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Vendor Type</label>
                  <p>{selectedInReviewForm.vendorType || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Visit Date</label>
                  <p>{formatDate(selectedInReviewForm.createdAt)}</p>
                </div>
                {selectedInReviewForm.reappearDate && (
                  <div className="exec-modal-field">
                    <label>Reappear Date</label>
                    <p>{formatDate(selectedInReviewForm.reappearDate)}</p>
                  </div>
                )}
              </div>

              <div className="exec-modal-divider" />

              {/* Group 2: Address */}
              <div className="exec-modal-grid">
                <div className="exec-modal-field exec-modal-field--full">
                  <label>Full Address</label>
                  <p>
                    {[
                      selectedInReviewForm.doorNumber,
                      selectedInReviewForm.streetName,
                      selectedInReviewForm.areaName,
                      selectedInReviewForm.district,
                      selectedInReviewForm.state,
                      selectedInReviewForm.pinCode,
                    ].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
                <div className="exec-modal-field">
                  <label>Vendor Location (Area)</label>
                  <p>{selectedInReviewForm.vendorLocation || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Coordinates</label>
                  <p>
                    {selectedInReviewForm.latitude && selectedInReviewForm.longitude
                      ? `${selectedInReviewForm.latitude}, ${selectedInReviewForm.longitude}`
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="exec-modal-divider" />

              {/* Group 3: Team & BPO */}
              <div className="exec-modal-grid">
                <div className="exec-modal-field">
                  <label>Executive</label>
                  <p>{selectedInReviewForm.executiveName || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>Team Lead</label>
                  <p>{selectedInReviewForm.teamleadName || "—"}</p>
                </div>
                <div className="exec-modal-field">
                  <label>BPO Name</label>
                  <p>{selectedInReviewForm.bpoName || "—"}</p>
                </div>
                {selectedInReviewForm.idNumber && (
                  <div className="exec-modal-field">
                    <label>ID Number</label>
                    <p>{selectedInReviewForm.idNumber}</p>
                  </div>
                )}
              </div>

              {/* Group 4: Reviews (shown only when at least one exists) */}
              {(selectedInReviewForm.review || selectedInReviewForm.executiveReview || selectedInReviewForm.vendorReview || selectedInReviewForm.vendorMessage) && (
                <>
                  <div className="exec-modal-divider" />
                  <div className="exec-modal-grid">
                    {selectedInReviewForm.review && (
                      <div className="exec-modal-field exec-modal-field--full">
                        <label>Review / Comments</label>
                        <div className="exec-card-review">"{selectedInReviewForm.review}"</div>
                      </div>
                    )}
                    {selectedInReviewForm.executiveReview && (
                      <div className="exec-modal-field exec-modal-field--full">
                        <label>Executive Review</label>
                        <div className="exec-card-review">"{selectedInReviewForm.executiveReview}"</div>
                      </div>
                    )}
                    {selectedInReviewForm.vendorReview && (
                      <div className="exec-modal-field exec-modal-field--full">
                        <label>Vendor Review</label>
                        <div className="exec-card-review">"{selectedInReviewForm.vendorReview}"</div>
                      </div>
                    )}
                    {selectedInReviewForm.vendorMessage && (
                      <div className="exec-modal-field exec-modal-field--full">
                        <label>Vendor Message</label>
                        <div className="exec-card-review">"{selectedInReviewForm.vendorMessage}"</div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Group 5: Resend / Approval meta (only rendered when present) */}
              {(selectedInReviewForm.resendRequested || selectedInReviewForm.resendReason || selectedInReviewForm.resendApproved != null) && (
                <>
                  <div className="exec-modal-divider" />
                  <div className="exec-modal-grid">
                    {selectedInReviewForm.resendRequested != null && (
                      <div className="exec-modal-field">
                        <label>Resend Requested</label>
                        <p>{String(selectedInReviewForm.resendRequested)}</p>
                      </div>
                    )}
                    {selectedInReviewForm.resendApproved != null && (
                      <div className="exec-modal-field">
                        <label>Resend Approved</label>
                        <p>{String(selectedInReviewForm.resendApproved)}</p>
                      </div>
                    )}
                    {selectedInReviewForm.resendReason && (
                      <div className="exec-modal-field exec-modal-field--full">
                        <label>Resend Reason</label>
                        <p>{selectedInReviewForm.resendReason}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="exec-modal-footer">
              <button
                className="exec-prompt-btn exec-prompt-btn--cancel"
                onClick={() => setSelectedInReviewForm(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 1: APPROVED REQUESTS LIST ── */}
      {showApprovedModal && (
        <div className="exec-modal-overlay" onClick={() => setShowApprovedModal(false)}>
          <div className="exec-modal" onClick={(e) => e.stopPropagation()}>
            <div className="exec-modal-header">
              <h3 className="exec-modal-title">Approved Requests ({approvedRequests.length})</h3>
              <button className="exec-modal-close" onClick={() => setShowApprovedModal(false)}>×</button>
            </div>
            
            <div className="exec-modal-body bg-slate-50">
              {approvedRequests.length === 0 ? (
                <div className="exec-empty-state">
                  <span className="exec-empty-state-icon">✅</span>
                  <p className="exec-empty-state-title">All caught up!</p>
                  <p className="exec-empty-state-sub">You have no forms waiting for resubmission.</p>
                </div>
              ) : (
                <div className="exec-approved-grid">
                  {approvedRequests.map(req => (
                    <div key={req.id} className="exec-card">
                      <div className="exec-card-header">
                        <span className="exec-card-id">#{req.id}</span>
                        <span className="exec-badge exec-badge--followup">Needs Edit</span>
                      </div>
                      <h3 className="exec-card-shop">🏪 {req.vendorShopName || 'Unnamed Shop'}</h3>
                      <div className="exec-approved-reasons">
                        <div className="reason-block">
                          <strong>Original Request:</strong>
                          <p>{req.resendReason || "N/A"}</p>
                        </div>
                        <div className="reason-block">
                          <strong>Manager Review:</strong>
                          <p>{req.review || "N/A"}</p>
                        </div>
                      </div>
                      <div className="exec-card-footer">
                        <span>📅 {formatDate(req.createdAt)}</span>
                        <button 
                          className="exec-btn exec-btn--primary"
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
        <div className="exec-modal-overlay exec-modal-overlay--edit" onClick={() => setEditingRequest(null)}>
          <div className="exec-modal exec-modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="exec-modal-header">
              <div className="exec-modal-header-titles">
                <h3 className="exec-modal-title">Edit Vendor details</h3>
                <span className="exec-modal-subtitle">#{editingRequest.id} — Manager Feedback: {editingRequest.resendReason}</span>
              </div>
              <button 
                className="exec-modal-close" 
                onClick={() => setEditingRequest(null)}
                disabled={isResubmitting}
              >
                ×
              </button>
            </div>

            <div className="exec-modal-body">
              <div className="exec-edit-form">
                <div className="exec-edit-section">
                  <h4>Core Details</h4>
                  <div className="exec-edit-grid">
                    <div className="exec-form-group">
                      <label>Shop Name*</label>
                      <input name="vendorShopName" value={editFormData.vendorShopName} onChange={handleEditChange} />
                    </div>
                    <div className="exec-form-group">
                      <label>Owner Name*</label>
                      <input name="vendorName" value={editFormData.vendorName} onChange={handleEditChange} />
                    </div>
                    <div className="exec-form-group">
                      <label>Contact Number</label>
                      <input name="contactNumber" value={editFormData.contactNumber} onChange={handleEditChange} />
                    </div>
                    <div className="exec-form-group">
                      <label>Email ID</label>
                      <input name="mailId" value={editFormData.mailId} onChange={handleEditChange} />
                    </div>
                  </div>
                </div>

                <div className="exec-edit-section">
                  <h4>Address Information</h4>
                  <div className="exec-edit-grid">
                    <div className="exec-form-group">
                      <label>Door Number</label>
                      <input name="doorNumber" value={editFormData.doorNumber} onChange={handleEditChange} />
                    </div>
                    <div className="exec-form-group">
                      <label>Street Name</label>
                      <input name="streetName" value={editFormData.streetName} onChange={handleEditChange} />
                    </div>
                    <div className="exec-form-group">
                      <label>Area Name</label>
                      <input name="areaName" value={editFormData.areaName} onChange={handleEditChange} />
                    </div>
                    <div className="exec-form-group">
                      <label>District*</label>
                      <input name="district" value={editFormData.district} onChange={handleEditChange} />
                    </div>
                    <div className="exec-form-group">
                      <label>PIN Code</label>
                      <input name="pinCode" value={editFormData.pinCode} onChange={handleEditChange} />
                    </div>
                    <div className="exec-form-group">
                      <label>State</label>
                      <input name="state" value={editFormData.state} onChange={handleEditChange} />
                    </div>
                    <div className="exec-form-group">
                      <label>Vendor Mode (Mapped Location)</label>
                      <input name="vendorLocation" value={editFormData.vendorLocation} onChange={handleEditChange} />
                    </div>
                  </div>
                </div>

                <div className="exec-edit-section">
                  <h4>Status & Review</h4>
                  <div className="exec-edit-grid">
                    <div className="exec-form-group">
                      <label>Status</label>
                      <select name="status" value={editFormData.status} onChange={handleEditChange}>
                        <option value="INTERESTED">Interested</option>
                        <option value="NOT_INTERESTED">Not Interested</option>
                        <option value="FOLLOW_UP">Follow Up</option>
                      </select>
                    </div>
                    <div className="exec-form-group">
                      <label>Vendor Type</label>
                      <select name="vendorType" value={editFormData.vendorType} onChange={handleEditChange}>
                        <option value="RESTAURANT">Restaurant</option>
                        <option value="GROCERY">Grocery</option>
                        <option value="PHARMACY">Pharmacy</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="exec-form-group" style={{ gridColumn: "1 / -1" }}>
                      <label>Review Notes</label>
                      <textarea name="review" rows="3" value={editFormData.review} onChange={handleEditChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="exec-modal-footer">
              <button 
                className="exec-prompt-btn exec-prompt-btn--cancel" 
                onClick={() => setEditingRequest(null)}
                disabled={isResubmitting}
              >
                Cancel
              </button>
              <button 
                className="exec-prompt-btn exec-prompt-btn--proceed"
                style={{ background: '#10b981', color: 'white', border: 'none' }}
                onClick={handleUpdateAndResubmit}
                disabled={isResubmitting || !editFormData.vendorShopName || !editFormData.vendorName || !editFormData.district}
              >
                {isResubmitting ? "Resubmitting..." : "Update & Resubmit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REQUEST TO MANAGER PROMPT MODAL ── */}
      {showRequestModal && (
        <div className="exec-modal-overlay exec-modal-overlay--prompt" onClick={handleCancelRequest}>
          <div className="exec-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="exec-prompt-header">
              <h4>Request Edit Access</h4>
              <button 
                className="exec-modal-close" 
                onClick={handleCancelRequest}
                disabled={isRequesting}
              >
                ×
              </button>
            </div>

            <div className="exec-prompt-body">
              <p className="exec-prompt-warning">
                You are about to request the manager to edit this form. 
                Please provide a reason below.
              </p>
              
              <div className="exec-prompt-field">
                <label htmlFor="requestReason">Reason <span style={{color: '#ef4444'}}>*</span></label>
                <textarea 
                  id="requestReason"
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="e.g. Need to update the contact number..."
                  disabled={isRequesting}
                  rows="3"
                />
              </div>
            </div>

            <div className="exec-prompt-footer">
              <button 
                className="exec-prompt-btn exec-prompt-btn--cancel"
                onClick={handleCancelRequest}
                disabled={isRequesting}
              >
                Cancel
              </button>
              <button 
                className="exec-prompt-btn exec-prompt-btn--proceed"
                onClick={handleProceedRequest}
                disabled={isRequesting || !requestReason.trim()}
              >
                {isRequesting ? "Submitting..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExecutiveDashboard;