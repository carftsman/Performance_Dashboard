import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VendorForm.css";

const VendorForm = ({
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
    vendorType: "",
    mailId:         "",
    doorNumber:     null,
    streetName:     "",
    areaName:       "",
    pinCode:        "",
    state:          "",
    district:       "",
    status:         "INTERESTED",
    review:         "",
  });

  const [errors, setErrors] = useState({});

  // ── Autofill when geocodedAddress arrives ──────────────────────────────────
  useEffect(() => {
    if (!geocodedAddress) return;
    console.log("geocodedAddress from location form", geocodedAddress);
    setFormData((prev) => ({
      ...prev,
      areaName:   geocodedAddress.areaName   || prev.areaName,
      streetName: geocodedAddress.streetName || prev.streetName,
      pinCode:    geocodedAddress.pinCode    || prev.pinCode,
      state:      geocodedAddress.state      || prev.state,
      district:   geocodedAddress.district   || prev.district,
    }));
    // Clear errors for autofilled fields
    setErrors((prev) => ({
      ...prev,
      areaName:   "",
      streetName: "",
      pinCode:    "",
      state:      "",
      district:   "",
    }));
  }, [geocodedAddress]);

  // ── Field validation ───────────────────────────────────────────────────────
  const statusOptions = ["INTERESTED", "NOT_INTERESTED"];
// ── Handle Input Change with Real-time Validation ──
const handleChange = (e) => {
  const { name, value } = e.target;
  let updatedValue = value;
  let errorMsg = "";

  // SHOP NAME
  if (name === "vendorShopName") {
    if (!/^[A-Za-z\s]*$/.test(value)) {
      errorMsg = "Shop name should contain only alphabets";
    }
  }

  // OWNER NAME
  if (name === "vendorName") {
    if (!/^[A-Za-z\s]*$/.test(value)) {
      errorMsg = "Owner name should contain only alphabets";
    }
  }

  // CONTACT NUMBER
  if (name === "contactNumber") {
    updatedValue = value.replace(/\D/g, "");

    if (updatedValue.length > 10) return;

    if (updatedValue && !/^[6-9]/.test(updatedValue)) {
      errorMsg = "Mobile number must start with 6-9";
    }

    if (updatedValue.length === 10 && !/^[6-9]\d{9}$/.test(updatedValue)) {
      errorMsg = "Enter valid 10 digit mobile number";
    }
  }

  // EMAIL
  if (name === "mailId") {
    if (
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      errorMsg = "Enter valid email address";
    }
  }

  // STREET NAME
  if (name === "streetName") {
    if (!/^[A-Za-z0-9\s-]*$/.test(value)) {
      errorMsg = "Street name can contain alphabets, numbers and -";
    }
  }

  // AREA NAME
  if (name === "areaName") {
    if (!/^[A-Za-z0-9\s-]*$/.test(value)) {
      errorMsg = "Area name can contain alphabets, numbers and -";
    }
  }

  // DISTRICT
  if (name === "district") {
    if (!/^[A-Za-z\s]*$/.test(value)) {
      errorMsg = "District should contain only alphabets";
    }
  }

  // STATE
  if (name === "state") {
    if (!/^[A-Za-z\s]*$/.test(value)) {
      errorMsg = "State should contain only alphabets";
    }
  }

  // PINCODE
  if (name === "pinCode") {
    updatedValue = value.replace(/\D/g, "");

    if (updatedValue.length > 6) return;

    if (updatedValue && updatedValue.startsWith("0")) {
      errorMsg = "Pin code cannot start with 0";
    }

    if (updatedValue.length === 6 && !/^[1-9][0-9]{5}$/.test(updatedValue)) {
      errorMsg = "Invalid pin code";
    }
  }

  // REVIEW
  if (name === "review") {
    if (!/^[A-Za-z\s]*$/.test(value)) {
      errorMsg = "Review should contain only alphabets";
    }
  }

  setFormData((prev) => ({
    ...prev,
    [name]: updatedValue,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: errorMsg,
  }));
};

const validateForm = () => {
  const newErrors = {};

  if (!formData.vendorShopName.trim())
    newErrors.vendorShopName = "Shop name is required";

  if (!formData.vendorName.trim())
    newErrors.vendorName = "Owner name is required";

  if (!formData.contactNumber)
    newErrors.contactNumber = "Contact number is required";
  else if (!/^[6-9]\d{9}$/.test(formData.contactNumber))
    newErrors.contactNumber = "Enter valid 10 digit mobile number";

  if (!formData.vendorType)
    newErrors.vendorType = "Vendor type is required";

  if (
    formData.mailId &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mailId)
  )
    newErrors.mailId = "Invalid email format";

  if (!formData.streetName.trim())
    newErrors.streetName = "Street name is required";

  if (!formData.areaName.trim())
    newErrors.areaName = "Area name is required";

  if (!formData.district.trim())
    newErrors.district = "District is required";

  if (!formData.state.trim())
    newErrors.state = "State is required";

  if (!formData.pinCode)
    newErrors.pinCode = "Pin code is required";
  else if (!/^[1-9][0-9]{5}$/.test(formData.pinCode))
    newErrors.pinCode = "Pin code must be 6 digits and cannot start with 0";

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
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      vendorShopName: "",
      vendorName:     "",
      vendorType:     "",
      contactNumber:  "",
      mailId:         "",
      doorNumber:     "",
      streetName:     "",
      areaName:       "",
      pinCode:        "",
      state:          "",
      district:       "",
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
    <div className="vendor-form-container">
      {/* ── LOCATION CAPTURE STRIP ── */}
      <div className="vendor-location-strip">
        <div className="vendor-location-info">
          <h3 className="vendor-location-title">
            <span role="img" aria-label="pin">📍</span> Location Check-in
          </h3>
          <p className="vendor-location-desc">
            {locationCaptured 
              ? "Location successfully captured. Address fields are auto-filled below."
              : "You must capture your current location before filling out this form."}
          </p>
        </div>
        
        <button
          type="button"
          onClick={onGetLocation}
          disabled={isGettingLocation || isSubmitting}
          className={`vendor-btn-location ${locationCaptured ? "vendor-btn-location--success" : ""}`}
        >
          {isGettingLocation ? (
            <><span className="vendor-spinner" /> Getting Location…</>
          ) : locationCaptured ? (
            "✓ Refresh Location"
          ) : (
            "Capture Location"
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="vendor-form-body">
        
        {/* ── SECTION 1: VENDOR INFO ── */}
        <section className="vendor-section">
          <h4 className="vendor-section-header">
            <span role="img" aria-label="store">🏪</span> Vendor Details
          </h4>
          <div className="vendor-grid">
            
            <div className="vendor-group">
              <label htmlFor="vendorShopName" className="vendor-label">
                Shop Name <span className="vendor-label-required">*</span>
              </label>
              <input
                type="text" id="vendorShopName" name="vendorShopName"
                value={formData.vendorShopName} onChange={handleChange}
                className={`vendor-input ${errors.vendorShopName ? "vendor-input--error" : ""}`}
                placeholder="Enter shop name" disabled={isDisabled} required
              />
              {errors.vendorShopName && <p className="vendor-error-text">⚠ {errors.vendorShopName}</p>}
            </div>

            <div className="vendor-group">
              <label htmlFor="vendorType" className="vendor-label">
                Vendor Type <span className="vendor-label-required">*</span>
              </label>
              <select
                id="vendorType" name="vendorType"
                value={formData.vendorType} onChange={handleChange}
                className={`vendor-input ${errors.vendorType ? "vendor-input--error" : ""}`}
                disabled={isDisabled} required
              >
                <option value="">Select Vendor Type</option>
                <option value="RESTAURANT">Restaurant</option>
                <option value="GROCERY">Grocery</option>
              </select>
              {errors.vendorType && <p className="vendor-error-text">⚠ {errors.vendorType}</p>}
            </div>

            <div className="vendor-group">
              <label htmlFor="vendorName" className="vendor-label">
                Owner Name <span className="vendor-label-required">*</span>
              </label>
              <input
                type="text" id="vendorName" name="vendorName"
                value={formData.vendorName} onChange={handleChange}
                className={`vendor-input ${errors.vendorName ? "vendor-input--error" : ""}`}
                placeholder="Enter owner name" disabled={isDisabled} required
              />
              {errors.vendorName && <p className="vendor-error-text">⚠ {errors.vendorName}</p>}
            </div>

            <div className="vendor-group">
              <label htmlFor="contactNumber" className="vendor-label">
                Contact Number <span className="vendor-label-required">*</span>
              </label>
              <input
                type="tel" id="contactNumber" name="contactNumber"
                value={formData.contactNumber} onChange={handleChange}
                className={`vendor-input ${errors.contactNumber ? "vendor-input--error" : ""}`}
                placeholder="10 digit mobile number" maxLength="10"
                disabled={isDisabled} required
              />
              {errors.contactNumber && <p className="vendor-error-text">⚠ {errors.contactNumber}</p>}
            </div>

            <div className="vendor-group vendor-group--full">
              <label htmlFor="mailId" className="vendor-label">
                Email ID
              </label>
              <input
                type="email" id="mailId" name="mailId"
                value={formData.mailId} onChange={handleChange}
                className={`vendor-input ${errors.mailId ? "vendor-input--error" : ""}`}
                placeholder="vendor@email.com" disabled={isDisabled}
              />
              {errors.mailId && <p className="vendor-error-text">⚠ {errors.mailId}</p>}
            </div>
            
          </div>
        </section>

        {/* ── SECTION 2: ADDRESS ── */}
        <section className="vendor-section">
          <h4 className="vendor-section-header">
            <span role="img" aria-label="map">🗺</span> Address Details
          </h4>
          <div className="vendor-grid">

            {/* <div className="vendor-group">
              <label htmlFor="doorNumber" className="vendor-label">
                Door Number <span className="vendor-label-required">*</span>
              </label>
              <input
                type="text" id="doorNumber" name="doorNumber"
                value={formData.doorNumber} onChange={handleChange}
                className={`vendor-input ${errors.doorNumber ? "vendor-input--error" : ""}`}
                placeholder="e.g. 1A / Flat 204" disabled={isDisabled} required
              />
              {errors.doorNumber && <p className="vendor-error-text">⚠ {errors.doorNumber}</p>}
            </div> */}

            <div className="vendor-group">
              <label htmlFor="streetName" className="vendor-label">
                Street Name <span className="vendor-label-required">*</span>
                {geocodedAddress?.streetName && <span className="vendor-label-auto">Auto-filled</span>}
              </label>
              <input
                type="text" id="streetName" name="streetName"
                value={formData.streetName} onChange={handleChange}
                className={`vendor-input ${errors.streetName ? "vendor-input--error" : ""}`}
                placeholder="Enter street name" disabled={isDisabled} required
              />
              {errors.streetName && <p className="vendor-error-text">⚠ {errors.streetName}</p>}
            </div>

            <div className="vendor-group">
              <label htmlFor="areaName" className="vendor-label">
                Area Name <span className="vendor-label-required">*</span>
                {geocodedAddress?.areaName && <span className="vendor-label-auto">Auto-filled</span>}
              </label>
              <input
                type="text" id="areaName" name="areaName"
                value={formData.areaName} onChange={handleChange}
                className={`vendor-input ${errors.areaName ? "vendor-input--error" : ""}`}
                placeholder="Enter area name" disabled={isDisabled} required
              />
              {errors.areaName && <p className="vendor-error-text">⚠ {errors.areaName}</p>}
            </div>

            <div className="vendor-group">
              <label htmlFor="district" className="vendor-label">
                District <span className="vendor-label-required">*</span>
                {geocodedAddress?.district && <span className="vendor-label-auto">Auto-filled</span>}
              </label>
              <input
                type="text" id="district" name="district"
                value={formData.district} onChange={handleChange}
                className={`vendor-input ${errors.district ? "vendor-input--error" : ""}`}
                placeholder="Enter district" disabled={isDisabled} required
              />
              {errors.district && <p className="vendor-error-text">⚠ {errors.district}</p>}
            </div>

            <div className="vendor-group">
              <label htmlFor="pinCode" className="vendor-label">
                Pin Code <span className="vendor-label-required">*</span>
                {geocodedAddress?.pinCode && <span className="vendor-label-auto">Auto-filled</span>}
              </label>
              <input
                type="text" id="pinCode" name="pinCode"
                value={formData.pinCode} onChange={handleChange}
                className={`vendor-input ${errors.pinCode ? "vendor-input--error" : ""}`}
                placeholder="6 digit pin code" maxLength="6"
                disabled={isDisabled} required
              />
              {errors.pinCode && <p className="vendor-error-text">⚠ {errors.pinCode}</p>}
            </div>

            <div className="vendor-group vendor-group--full">
              <label htmlFor="state" className="vendor-label">
                State <span className="vendor-label-required">*</span>
                {geocodedAddress?.state && <span className="vendor-label-auto">Auto-filled</span>}
              </label>
              <input
                type="text" id="state" name="state"
                value={formData.state} onChange={handleChange}
                className={`vendor-input ${errors.state ? "vendor-input--error" : ""}`}
                placeholder="Enter state" disabled={isDisabled} required
              />
              {errors.state && <p className="vendor-error-text">⚠ {errors.state}</p>}
            </div>

            

          </div>
        </section>

        {/* ── SECTION 3: VISIT DETAILS ── */}
        <section className="vendor-section">
          <h4 className="vendor-section-header">
            <span role="img" aria-label="clipboard">📋</span> Visit Details
          </h4>
          <div className="vendor-grid">
            
            <div className="vendor-group vendor-group--full">
              <label htmlFor="status" className="vendor-label">
                Vendor Status <span className="vendor-label-required">*</span>
              </label>
              <select
                id="status" name="status"
                value={formData.status} onChange={handleChange}
                className={`vendor-input ${errors.status ? "vendor-input--error" : ""}`}
                disabled={isDisabled} required
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            <div className="vendor-group vendor-group--full">
              <label htmlFor="review" className="vendor-label">
                Review / Comments
              </label>
              <textarea
                id="review" name="review"
                value={formData.review} onChange={handleChange}
                className="vendor-input"
                placeholder="Add any additional notes about the visit..."
                disabled={isDisabled}
              />
            </div>

          </div>
        </section>

        {/* ── WARNING & ACTIONS ── */}
        {!locationCaptured && (
          <div className="vendor-warning-box">
            <span role="img" aria-label="warning">⚠️</span>
            Please capture your location using the button at the top to enable form submission.
          </div>
        )}

        <div className="vendor-actions">
          <button
            type="button" 
            onClick={handleReset}
            disabled={isSubmitting}
            className="vendor-btn vendor-btn--secondary"
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={isDisabled}
            className="vendor-btn vendor-btn--primary"
          >
            {isSubmitting ? "Submitting…" : "Submit Record"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default VendorForm;
