import React, { useState, useEffect } from "react";

const LocationForm = ({ onSubmit, locationEnabled, isSubmitting, userCode }) => {
  const [formData, setFormData] = useState({
    vendorShopName: "",
    vendorName: "",
    contactNumber: "",
    mailId: "",
    doorNumber: "",
    streetName: "",
    areaName: "",
    pinCode: "",
    state: "",
    status: "INTERESTED",
    review: ""
  });

  const [errors, setErrors] = useState({});

  // Status options
  const statusOptions = [
    "INTERESTED",
    "NOT_INTERESTED",
    "FOLLOW_UP",
    "VISITED",
    "CONVERTED"
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Vendor Shop Name validation
    if (!formData.vendorShopName.trim()) {
      newErrors.vendorShopName = "Vendor shop name is required";
    }

    // Vendor Name validation
    if (!formData.vendorName.trim()) {
      newErrors.vendorName = "Vendor name is required";
    }

    // Contact Number validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }

    // Email validation
    if (formData.mailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mailId)) {
      newErrors.mailId = "Invalid email format";
    }

    // Door Number validation
    if (!formData.doorNumber.trim()) {
      newErrors.doorNumber = "Door number is required";
    }

    // Street Name validation
    if (!formData.streetName.trim()) {
      newErrors.streetName = "Street name is required";
    }

    // Area Name validation
    if (!formData.areaName.trim()) {
      newErrors.areaName = "Area name is required";
    }

    // Pin Code validation
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "Pin code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Pin code must be 6 digits";
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // Status validation
    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!locationEnabled) {
      alert("Please enable location access before submitting");
      return;
    }

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      vendorShopName: "",
      vendorName: "",
      contactNumber: "",
      mailId: "",
      doorNumber: "",
      streetName: "",
      areaName: "",
      pinCode: "",
      state: "",
      status: "INTERESTED",
      review: ""
    });
    setErrors({});
  };

  return (
    <div className="card">
      <h3 className="card-title">📝 New Vendor Entry</h3>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Please fill in the vendor details. Location will be automatically captured.
      </p>

      <form onSubmit={handleSubmit} className="location-form">
        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          
          {/* Vendor Shop Name */}
          <div className="form-group">
            <label htmlFor="vendorShopName">Vendor Shop Name *</label>
            <input
              type="text"
              id="vendorShopName"
              name="vendorShopName"
              value={formData.vendorShopName}
              onChange={handleChange}
              className={`input-field ${errors.vendorShopName ? 'error' : ''}`}
              placeholder="Enter shop name"
              disabled={!locationEnabled || isSubmitting}
            />
            {errors.vendorShopName && <small className="error-text" style={{ color: 'red' }}>{errors.vendorShopName}</small>}
          </div>

          {/* Vendor Name */}
          <div className="form-group">
            <label htmlFor="vendorName">Vendor Name *</label>
            <input
              type="text"
              id="vendorName"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              className={`input-field ${errors.vendorName ? 'error' : ''}`}
              placeholder="Enter vendor name"
              disabled={!locationEnabled || isSubmitting}
            />
            {errors.vendorName && <small className="error-text" style={{ color: 'red' }}>{errors.vendorName}</small>}
          </div>

          {/* Contact Number */}
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number *</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={`input-field ${errors.contactNumber ? 'error' : ''}`}
              placeholder="10 digit mobile number"
              maxLength="10"
              disabled={!locationEnabled || isSubmitting}
            />
            {errors.contactNumber && <small className="error-text" style={{ color: 'red' }}>{errors.contactNumber}</small>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="mailId">Email ID</label>
            <input
              type="email"
              id="mailId"
              name="mailId"
              value={formData.mailId}
              onChange={handleChange}
              className={`input-field ${errors.mailId ? 'error' : ''}`}
              placeholder="vendor@email.com"
              disabled={!locationEnabled || isSubmitting}
            />
            {errors.mailId && <small className="error-text" style={{ color: 'red' }}>{errors.mailId}</small>}
          </div>

          {/* Door Number */}
          <div className="form-group">
            <label htmlFor="doorNumber">Door Number *</label>
            <input
              type="text"
              id="doorNumber"
              name="doorNumber"
              value={formData.doorNumber}
              onChange={handleChange}
              className={`input-field ${errors.doorNumber ? 'error' : ''}`}
              placeholder="Enter door number"
              disabled={!locationEnabled || isSubmitting}
            />
            {errors.doorNumber && <small className="error-text" style={{ color: 'red' }}>{errors.doorNumber}</small>}
          </div>

          {/* Street Name */}
          <div className="form-group">
            <label htmlFor="streetName">Street Name *</label>
            <input
              type="text"
              id="streetName"
              name="streetName"
              value={formData.streetName}
              onChange={handleChange}
              className={`input-field ${errors.streetName ? 'error' : ''}`}
              placeholder="Enter street name"
              disabled={!locationEnabled || isSubmitting}
            />
            {errors.streetName && <small className="error-text" style={{ color: 'red' }}>{errors.streetName}</small>}
          </div>

          {/* Area Name */}
          <div className="form-group">
            <label htmlFor="areaName">Area Name *</label>
            <input
              type="text"
              id="areaName"
              name="areaName"
              value={formData.areaName}
              onChange={handleChange}
              className={`input-field ${errors.areaName ? 'error' : ''}`}
              placeholder="Enter area name"
              disabled={!locationEnabled || isSubmitting}
            />
            {errors.areaName && <small className="error-text" style={{ color: 'red' }}>{errors.areaName}</small>}
          </div>

          {/* Pin Code */}
          <div className="form-group">
            <label htmlFor="pinCode">Pin Code *</label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              className={`input-field ${errors.pinCode ? 'error' : ''}`}
              placeholder="6 digit pin code"
              maxLength="6"
              disabled={!locationEnabled || isSubmitting}
            />
            {errors.pinCode && <small className="error-text" style={{ color: 'red' }}>{errors.pinCode}</small>}
          </div>

          {/* State */}
          <div className="form-group">
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`input-field ${errors.state ? 'error' : ''}`}
              placeholder="Enter state"
              disabled={!locationEnabled || isSubmitting}
            />
            {errors.state && <small className="error-text" style={{ color: 'red' }}>{errors.state}</small>}
          </div>

          {/* Status Dropdown */}
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`input-field ${errors.status ? 'error' : ''}`}
              disabled={!locationEnabled || isSubmitting}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option.replace('_', ' ')}</option>
              ))}
            </select>
            {errors.status && <small className="error-text" style={{ color: 'red' }}>{errors.status}</small>}
          </div>

          {/* Review - Full width */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label htmlFor="review">Review / Comments</label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your review or comments about the visit"
              rows="4"
              disabled={!locationEnabled || isSubmitting}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            Reset Form
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!locationEnabled || isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: !locationEnabled ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (!locationEnabled || isSubmitting) ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Entry with Location'}
          </button>
        </div>

        {/* Location disabled message */}
        {!locationEnabled && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', textAlign: 'center' }}>
            ⚠️ Please enable location access to submit the form
          </div>
        )}
      </form>

      <style jsx>{`
        .input-field.error {
          border-color: red;
        }
        .error-text {
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }
        .input-field {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .input-field:focus {
          outline: none;
          border-color: #007bff;
        }
        .input-field:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default LocationForm;