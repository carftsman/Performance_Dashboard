




import React, { useEffect, useState } from "react";
import VendorForm from "../components/Executive/VendorForm";
import { formService } from "../Services/form.service";
import "./ExecutiveDashboard.css";

const ExecutiveDashboard = ({ user, logout }) => {

  const [locationAllowed, setLocationAllowed] = useState(false);
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

  // ── Search state ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) return <h2>No User Found. Please Login Again.</h2>;

  /* =========================================
     LOAD HISTORY (RESTORED)
  ========================================== */
  useEffect(() => {
    loadHistory();
  }, []);

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

  /* =========================================
     ENABLE LOCATION
  ========================================== */
  const handleEnableLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationAllowed(true);
        alert("Location Permission Granted ✅");
      },
      () => alert("Location Permission Denied ❌")
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
      () => alert("Unable to fetch start location")
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
            };

            setGeocodedAddress(address);
          }

        } catch (error) {
          console.error("Reverse geocode failed");
        }

        setIsGettingLocation(false);
      },
      () => {
        alert("Unable to capture vendor location");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* =========================================
     SUBMIT FORM
  ========================================== */

 const handleSubmitDailyLog = async (formData) => {

  if (!vendorLocation) {
    alert("Please capture vendor location");
    return;
  }

  setIsSubmitting(true);

  try {

    const submissionData = {
      ...formData,

      // ✅ Backend expects flat latitude & longitude
      latitude: vendorLocation.latitude,
      longitude: vendorLocation.longitude,

      // ✅ Backend expects vendorLocation as STRING
      vendorLocation:
        geocodedAddress?.areaName ||
        geocodedAddress?.streetName ||
        "Current Location",

      // DO NOT send workStartLocation
    };

    console.log("Submitting to backend:", submissionData);

    await formService.createForm(submissionData);

    alert("Form submitted successfully!");

    setVendorLocation(null);
    setGeocodedAddress(null);
    setShowForm(false);

    loadHistory();

  } catch (error) {
    console.error("Submission failed:", error.response?.data);
    alert("Submission failed");
  } finally {
    setIsSubmitting(false);
  }
};
  // ── Request to Manager Handler ────────────────────────────────────────────
  const handleProceedRequest = async () => {
    if (!requestReason.trim()) {
      alert("Please enter a reason for the request.");
      return;
    }

    try {
      setIsRequesting(true);
      const payload = {
        formId: selectedForm.id,
        reason: requestReason.trim(),
      };
      await formService.resendRequest(payload);
      alert("Request sent successfully to the manager.");
      // Reset request modal state
      setShowRequestModal(false);
      setRequestReason("");
      // Close the detail modal
      setSelectedForm(null);
    } catch (err) {
      console.error("Failed to send request:", err);
      alert("Failed to send request. Please try again later.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCancelRequest = () => {
    setShowRequestModal(false);
    setRequestReason("");
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
    });
  };

  /* =========================================
     RENDER
  ========================================== */
  return (
    <div className="exec-page">

      {/* ── TOP NAVBAR ── */}
      <nav className="exec-navbar">
        <div className="exec-navbar-brand">
          <div className="exec-navbar-brand-icon">👤</div>
          <div>
            <div className="exec-navbar-brand-text">{user.userCode || user.name || "Executive"}</div>
            <div className="exec-navbar-brand-sub">Field Executive</div>
          </div>
        </div>

        <div className="exec-navbar-actions">
          {!locationAllowed && (
            <button className="exec-btn exec-btn--location" onClick={handleEnableLocation}>
              📍 Enable Location
            </button>
          )}

          {!workStarted && (
            <button
              className="exec-btn exec-btn--start"
              disabled={!locationAllowed}
              onClick={handleStartWork}
              title={!locationAllowed ? "Enable location first" : "Start your work session"}
            >
              ▶ Start Work
            </button>
          )}

          {workStarted && !showForm && (
            <button
              className="exec-btn exec-btn--new-entry"
              onClick={() => setShowForm(true)}
            >
              + New Entry
            </button>
          )}

          <button className="exec-btn exec-btn--logout" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── STATUS BAR ── */}
      <div className="exec-status-bar">
        <span>Status:</span>
        {workStarted ? (
          <span className="exec-status-pill exec-status-pill--active">
            <span className="exec-status-dot" />
            Work In Progress
          </span>
        ) : locationAllowed ? (
          <span className="exec-status-pill exec-status-pill--inactive">
            <span className="exec-status-dot" />
            Location Ready — Start Work to Begin
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

        {/* ── HISTORY SECTION ── */}
        {!showForm && (
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
                      selectedForm.doorNumber, 
                      selectedForm.streetName, 
                      selectedForm.areaName, 
                      selectedForm.state, 
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