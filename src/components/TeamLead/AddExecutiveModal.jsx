import { useState, useEffect } from "react";
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
      const response = await teamLeadService.createExecutive(newExecutive);
      console.log('Execuitve added',response);
      
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
   <>
    <style>{`
    /* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
}

/* Modal Content */
.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.btn-close:hover:not(:disabled) {
  color: #000;
}

/* Alerts */
.alert {
  padding: 0.75rem 1rem;
  border-radius: 5px;
  font-size: 0.95rem;
}

.alert-success {
  background-color: #e6ffed;
  color: #2d7a46;
  border: 1px solid #2d7a46;
}

.alert-error {
  background-color: #ffe6e6;
  color: #c72c2c;
  border: 1px solid #c72c2c;
}

/* Form */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-weight: 500;
  color: #444;
  font-size: 0.95rem;
}

.form-group input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus:not(:disabled) {
  border-color: #007bff;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.modal-actions .btn {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .modal-content {
    padding: 1rem;
  }

  .modal-header h2 {
    font-size: 1.25rem;
  }

  .form-group input {
    font-size: 0.95rem;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
}
    `}</style>
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
            <label htmlFor="executiveCode">Executive Code</label>
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
            <label htmlFor="phone">Phone Number</label>
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
   </>
  );
};

export default AddExecutiveModal;