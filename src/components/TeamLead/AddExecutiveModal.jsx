import React, { useState, useEffect } from "react";
import teamLeadService from "../../Services/teamlead.service";

const AddExecutiveModal = ({ 
  isOpen, 
  onClose, 
  onExecutiveAdded 
}) => {

  const [newExecutive, setNewExecutive] = useState({
    executiveCode: "",
    name: "",
    phone: ""
  });

  const [isAddingExecutive, setIsAddingExecutive] = useState(false);
  const [executiveAddSuccess, setExecutiveAddSuccess] = useState(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNewExecutive({
        executiveCode: "",
        name: "",
        phone: ""
      });
      setExecutiveAddSuccess(null);
    }
  }, [isOpen]);

  const handleExecutiveInputChange = (e) => {
    const { name, value } = e.target;
    setNewExecutive(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExecutive = async (e) => {
    e.preventDefault();

    if (!newExecutive.executiveCode || !newExecutive.name || !newExecutive.phone) {
      setExecutiveAddSuccess({
        type: "error",
        message: "All fields are required"
      });
      return;
    }

    if (!/^\d{10}$/.test(newExecutive.phone)) {
      setExecutiveAddSuccess({
        type: "error",
        message: "Phone must be 10 digits"
      });
      return;
    }

    try {
      setIsAddingExecutive(true);
      setExecutiveAddSuccess(null);

      await teamLeadService.createExecutive(newExecutive);

      setExecutiveAddSuccess({
        type: "success",
        message: "Executive added successfully!"
      });

      // Refresh list
      onExecutiveAdded && onExecutiveAdded();

      // Auto close after 2s
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setExecutiveAddSuccess({
        type: "error",
        message: error.response?.data?.message || "Failed to add executive"
      });
    } finally {
      setIsAddingExecutive(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        {/* Header */}
        <div className="modal-header">
          <h2>Add New Executive</h2>
          <button
            onClick={onClose}
            className="btn-close"
            disabled={isAddingExecutive}
          >
            ×
          </button>
        </div>

        {/* Success/Error Message */}
        {executiveAddSuccess && (
          <div className={`alert ${executiveAddSuccess.type === "success" ? "alert-success" : "alert-error"}`}>
            {executiveAddSuccess.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAddExecutive}>

          <div className="form-group">
            <label htmlFor="executiveCode">Executive Code *</label>
            <input
              type="text"
              id="executiveCode"
              name="executiveCode"
              value={newExecutive.executiveCode}
              onChange={handleExecutiveInputChange}
              placeholder="Enter executive code"
              required
              disabled={isAddingExecutive}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newExecutive.name}
              onChange={handleExecutiveInputChange}
              placeholder="Enter executive name"
              required
              disabled={isAddingExecutive}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={newExecutive.phone}
              onChange={handleExecutiveInputChange}
              placeholder="Enter 10-digit phone number"
              pattern="[0-9]{10}"
              maxLength="10"
              required
              disabled={isAddingExecutive}
            />
          </div>

          {/* Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isAddingExecutive}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isAddingExecutive}
            >
              {isAddingExecutive ? "Adding..." : "Add Executive"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddExecutiveModal;