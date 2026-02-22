import React, { useState } from "react";
import teamLeadService from "../../Services/teamlead.service";

function AddExecutive({ onExecutiveAdded }) {
  const [showAddExecutiveModal, setShowAddExecutiveModal] = useState(false);
  const [newExecutive, setNewExecutive] = useState({
    executiveCode: "",
    name: "",
    phone: "",
  });
  const [executiveAddSuccess, setExecutiveAddSuccess] = useState(null);

  const handleExecutiveInputChange = (e) => {
    const { name, value } = e.target;
    setNewExecutive((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setShowAddExecutiveModal(false);
    setNewExecutive({ executiveCode: "", name: "", phone: "" });
    setExecutiveAddSuccess(null);
  };

  return (
    <>
      {/* CSS INSIDE COMPONENT */}
      <style>
        {`
        .add-executive-btn {
          background: #2563eb;
          color: white;
          padding: 12px 22px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }
        .add-executive-btn:hover {
          background: #1d4ed8;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(225, 20, 20, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .modal-box {
          background: #ffffff;
          width: 420px;
          border-radius: 10px;
          padding: 22px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.25);
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
        }

        .form-group {
          margin-bottom: 14px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 9px 12px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          margin-top: 6px;
          outline: none;
          transition: 0.2s;
        }

        .form-group input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }

        .btn-cancel {
          background: #e5e7eb;
          color: #111827;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .alert-success {
          background: #d1fae5;
          color: #065f46;
          padding: 8px;
          border-radius: 6px;
          margin-bottom: 10px;
          font-size: 13px;
        }

        .alert-error {
          background: #fee2e2;
          color: #7f1d1d;
          padding: 8px;
          border-radius: 6px;
          margin-bottom: 10px;
          font-size: 13px;
        }
        `}
      </style>

      {/* BUTTON */}
      <button
        className="add-executive-btn"
        onClick={() => setShowAddExecutiveModal(true)}
      >
        + Add Executive
      </button>

      {/* MODAL */}
      {showAddExecutiveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">Add New Executive</h2>
              <button className="close-btn" onClick={handleCloseModal}>✖</button>
            </div>

            {executiveAddSuccess && (
              <div
                className={
                  executiveAddSuccess.type === "success"
                    ? "alert-success"
                    : "alert-error"
                }
              >
                {executiveAddSuccess.message}
              </div>
            )}

            <form>
              <div className="form-group">
                <label>Executive Code</label>
                <input
                  name="executiveCode"
                  value={newExecutive.executiveCode}
                  onChange={handleExecutiveInputChange}
                  placeholder="Enter code"
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={newExecutive.name}
                  onChange={handleExecutiveInputChange}
                  placeholder="Enter name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phone"
                  maxLength="10"
                  value={newExecutive.phone}
                  onChange={handleExecutiveInputChange}
                  placeholder="10-digit number"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Executive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddExecutive;