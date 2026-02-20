
import React, { useState, useEffect } from "react";
import axios from "axios";
const LocationForm = ({
  onSubmit,
  locationCaptured,   // true once GPS coords have been captured
  isSubmitting,
  userCode,
  geocodedAddress,    // { areaName, streetName, pinCode, state } from reverse geocode
  onGetLocation,      // callback to trigger GPS + geocode in parent
  isGettingLocation,  // true while GPS / geocode request is in progress
}) => {
  const [formData, setFormData] = useState({
    vendorShopName: "",
    vendorName:     "",
    contactNumber:  "",
    mailId:         "",
    doorNumber:     "",
    streetName:     "",
    areaName:       "",
    pinCode:        "",
    state:          "",
    status:         "INTERESTED",
    review:         "",
  });

  const [errors, setErrors] = useState({});

  // ── Autofill when geocodedAddress arrives ──────────────────────────────────
  useEffect(() => {
    if (!geocodedAddress) return;
    setFormData((prev) => ({
      ...prev,
      areaName:   geocodedAddress.areaName   || prev.areaName,
      streetName: geocodedAddress.streetName || prev.streetName,
      pinCode:    geocodedAddress.pinCode    || prev.pinCode,
      state:      geocodedAddress.state      || prev.state,
    }));
    // Clear errors for autofilled fields
    setErrors((prev) => ({
      ...prev,
      areaName:   "",
      streetName: "",
      pinCode:    "",
      state:      "",
    }));
  }, [geocodedAddress]);

  // ── Field validation ───────────────────────────────────────────────────────
  const statusOptions = ["INTERESTED", "NOT_INTERESTED"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vendorShopName.trim())
      newErrors.vendorShopName = "Vendor shop name is required";

    if (!formData.vendorName.trim())
      newErrors.vendorName = "Vendor name is required";

    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Contact number must be 10 digits";

    if (formData.mailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mailId))
      newErrors.mailId = "Invalid email format";

    if (!formData.doorNumber.trim())
      newErrors.doorNumber = "Door number is required";

    if (!formData.streetName.trim())
      newErrors.streetName = "Street name is required";

    if (!formData.areaName.trim())
      newErrors.areaName = "Area name is required";

    if (!formData.pinCode.trim())
      newErrors.pinCode = "Pin code is required";
    else if (!/^\d{6}$/.test(formData.pinCode))
      newErrors.pinCode = "Pin code must be 6 digits";

    if (!formData.state.trim())
      newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!locationCaptured) {
      alert('Please click "📍 Get Current Location" before submitting.');
      return;
    }

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      vendorShopName: "",
      vendorName:     "",
      contactNumber:  "",
      mailId:         "",
      doorNumber:     "",
      streetName:     "",
      areaName:       "",
      pinCode:        "",
      state:          "",
      status:         "INTERESTED",
      review:         "",
    });
    setErrors({});
  };
 
  // ── Helpers ────────────────────────────────────────────────────────────────
  const isDisabled = !locationCaptured || isSubmitting;

  const btnStyle = (bg, disabled) => ({
    padding:       "12px 25px",
    backgroundColor: disabled ? "#ccc" : bg,
    color:         "white",
    border:        "none",
    borderRadius:  "6px",
    cursor:        disabled ? "not-allowed" : "pointer",
    fontSize:      "15px",
    fontWeight:    "bold",
    transition:    "background 0.2s",
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="card">
      <h3 className="card-title">📝 New Vendor Entry</h3>

      {/* ── Get Location button ── */}
      <div style={{ marginBottom: "20px" }}>
        <button
          type="button"
          onClick={onGetLocation}
          disabled={isGettingLocation || isSubmitting}
          style={{
            padding:         "12px 24px",
            backgroundColor: locationCaptured ? "#28a745" : "#007bff",
            color:           "white",
            border:          "none",
            borderRadius:    "6px",
            cursor:          isGettingLocation || isSubmitting ? "not-allowed" : "pointer",
            fontSize:        "15px",
            fontWeight:      "bold",
            display:         "flex",
            alignItems:      "center",
            gap:             "8px",
          }}
        >
          {isGettingLocation ? (
            <>
              <span
                style={{
                  display:      "inline-block",
                  width:        "15px",
                  height:       "15px",
                  border:       "2px solid white",
                  borderTop:    "2px solid transparent",
                  borderRadius: "50%",
                  animation:    "spin 0.8s linear infinite",
                }}
              />
              Getting Location…
            </>
          ) : locationCaptured ? (
            "✅ Location Captured — Click to Refresh"
          ) : (
            "📍 Get Current Location"
          )}
        </button>

        {!locationCaptured && !isGettingLocation && (
          <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#666" }}>
            ⚠️ Click the button above to capture your location before filling the form.
          </p>
        )}

        {locationCaptured && geocodedAddress && (
          <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#28a745" }}>
            ✓ Address fields auto-filled from your location. You can edit them if needed.
          </p>
        )}
      </div>

      {/* spin keyframe injected inline once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <form onSubmit={handleSubmit} className="location-form">
        <div
          className="form-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}
        >
          {/* Vendor Shop Name */}
          <div className="form-group">
            <label htmlFor="vendorShopName">Vendor Shop Name *</label>
            <input
              type="text" id="vendorShopName" name="vendorShopName"
              value={formData.vendorShopName} onChange={handleChange}
              className={`input-field ${errors.vendorShopName ? "error" : ""}`}
              placeholder="Enter shop name" disabled={isDisabled} required
            />
            {errors.vendorShopName && (
              <small className="error-text" style={{ color: "red" }}>{errors.vendorShopName}</small>
            )}
          </div>

          {/* Vendor Name */}
          <div className="form-group">
            <label htmlFor="vendorName">Vendor Name *</label>
            <input
              type="text" id="vendorName" name="vendorName"
              value={formData.vendorName} onChange={handleChange}
              className={`input-field ${errors.vendorName ? "error" : ""}`}
              placeholder="Enter vendor name" disabled={isDisabled} required
            />
            {errors.vendorName && (
              <small className="error-text" style={{ color: "red" }}>{errors.vendorName}</small>
            )}
          </div>

          {/* Contact Number */}
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number *</label>
            <input
              type="tel" id="contactNumber" name="contactNumber"
              value={formData.contactNumber} onChange={handleChange}
              className={`input-field ${errors.contactNumber ? "error" : ""}`}
              placeholder="10 digit mobile number" maxLength="10"
              disabled={isDisabled} required
            />
            {errors.contactNumber && (
              <small className="error-text" style={{ color: "red" }}>{errors.contactNumber}</small>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="mailId">Email ID</label>
            <input
              type="email" id="mailId" name="mailId"
              value={formData.mailId} onChange={handleChange}
              className={`input-field ${errors.mailId ? "error" : ""}`}
              placeholder="vendor@email.com" disabled={isDisabled}
            />
            {errors.mailId && (
              <small className="error-text" style={{ color: "red" }}>{errors.mailId}</small>
            )}
          </div>

          {/* Door Number */}
          <div className="form-group">
            <label htmlFor="doorNumber">Door Number *</label>
            <input
              type="text" id="doorNumber" name="doorNumber"
              value={formData.doorNumber} onChange={handleChange}
              className={`input-field ${errors.doorNumber ? "error" : ""}`}
              placeholder="Enter door number" disabled={isDisabled} required
            />
            {errors.doorNumber && (
              <small className="error-text" style={{ color: "red" }}>{errors.doorNumber}</small>
            )}
          </div>

          {/* Street Name — can be autofilled */}
          <div className="form-group">
            <label htmlFor="streetName">
              Street Name *{" "}
              {geocodedAddress?.streetName && (
                <span style={{ fontSize: "11px", color: "#28a745", fontWeight: "normal" }}>
                  (auto-filled)
                </span>
              )}
            </label>
            <input
              type="text" id="streetName" name="streetName"
              value={formData.streetName} onChange={handleChange}
              className={`input-field ${errors.streetName ? "error" : ""}`}
              placeholder="Enter street name" disabled={isDisabled} required
            />
            {errors.streetName && (
              <small className="error-text" style={{ color: "red" }}>{errors.streetName}</small>
            )}
          </div>

          {/* Area Name — autofilled */}
          <div className="form-group">
            <label htmlFor="areaName">
              Area Name *{" "}
              {geocodedAddress?.areaName && (
                <span style={{ fontSize: "11px", color: "#28a745", fontWeight: "normal" }}>
                  (auto-filled)
                </span>
              )}
            </label>
            <input
              type="text" id="areaName" name="areaName"
              value={formData.areaName} onChange={handleChange}
              className={`input-field ${errors.areaName ? "error" : ""}`}
              placeholder="Enter area name" disabled={isDisabled} required
            />
            {errors.areaName && (
              <small className="error-text" style={{ color: "red" }}>{errors.areaName}</small>
            )}
          </div>

          {/* Pin Code — autofilled */}
          <div className="form-group">
            <label htmlFor="pinCode">
              Pin Code *{" "}
              {geocodedAddress?.pinCode && (
                <span style={{ fontSize: "11px", color: "#28a745", fontWeight: "normal" }}>
                  (auto-filled)
                </span>
              )}
            </label>
            <input
              type="text" id="pinCode" name="pinCode"
              value={formData.pinCode} onChange={handleChange}
              className={`input-field ${errors.pinCode ? "error" : ""}`}
              placeholder="6 digit pin code" maxLength="6"
              disabled={isDisabled} required
            />
            {errors.pinCode && (
              <small className="error-text" style={{ color: "red" }}>{errors.pinCode}</small>
            )}
          </div>

          {/* State — autofilled */}
          <div className="form-group">
            <label htmlFor="state">
              State *{" "}
              {geocodedAddress?.state && (
                <span style={{ fontSize: "11px", color: "#28a745", fontWeight: "normal" }}>
                  (auto-filled)
                </span>
              )}
            </label>
            <input
              type="text" id="state" name="state"
              value={formData.state} onChange={handleChange}
              className={`input-field ${errors.state ? "error" : ""}`}
              placeholder="Enter state" disabled={isDisabled} required
            />
            {errors.state && (
              <small className="error-text" style={{ color: "red" }}>{errors.state}</small>
            )}
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status" name="status"
              value={formData.status} onChange={handleChange}
              className={`input-field ${errors.status ? "error" : ""}`}
              disabled={isDisabled} required
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          {/* Review — full width */}
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label htmlFor="review">Review / Comments</label>
            <textarea
              id="review" name="review"
              value={formData.review} onChange={handleChange}
              className="input-field"
              placeholder="Enter your review or comments about the visit"
              rows="4" disabled={isDisabled}
              style={{ width: "100%", resize: "vertical" }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "15px", marginTop: "30px", justifyContent: "flex-end" }}>
          <button
            type="button" onClick={handleReset}
            disabled={isSubmitting}
            style={btnStyle("#6c757d", isSubmitting)}
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={!locationCaptured || isSubmitting}
            style={btnStyle("#007bff", !locationCaptured || isSubmitting)}
          >
            {isSubmitting ? "📤 Submitting…" : "📍 Submit"}
          </button>
        </div>

        {/* Location not yet captured warning under submit */}
        {!locationCaptured && (
          <p style={{
            marginTop: "12px", textAlign: "center",
            fontSize: "13px", color: "#856404",
            backgroundColor: "#fff3cd", padding: "8px",
            borderRadius: "4px", border: "1px solid #ffeeba",
          }}>
            ⚠️ You must capture your location before submitting this form.
          </p>
        )}
      </form>
    </div>
  );
};

export default LocationForm;
