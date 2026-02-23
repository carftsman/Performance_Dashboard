import React from "react";

const DashboardHeader = ({
  dashboardUser,
  loading,
  onAddExecutive,
  onAddEntry,
  onRefresh,
}) => {
  return (
    <>
      {/* CSS INSIDE COMPONENT */}
      <style>
        {`
        .header-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #eee;
  margin-bottom: 20px;
}

/* Layout */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

/* Left Title */
.header-left h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.text-muted {
  color: #6b7280;
  font-size: 14px;
}

/* Buttons */
.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.15s ease;
}

.btn-success {
  background: #16a34a;
  color: white;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Small hover scale (optional remove if you want no hover) */
.btn:hover:not(:disabled) {
  transform: scale(1.03);
}

/* ================= RESPONSIVE ================= */

/* Tablets */
@media (max-width: 1024px) {
  .header-left h1 {
    font-size: 20px;
  }

  .btn {
    font-size: 13px;
    padding: 7px 12px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}

/* Extra Small Mobile */
@media (max-width: 480px) {
  .header-card {
    padding: 14px;
  }

  .header-left h1 {
    font-size: 18px;
  }

  .text-muted {
    font-size: 12px;
  }
}`}
      </style>
      {/* HEADER UI */}
      <div className="card header-card">
        <div className="header-content">
          <div className="header-left">
            <div>
              <h1>Team Lead Dashboard - {dashboardUser?.userCode}
              </h1>
              
            </div>
          </div>

          <div className="header-actions">
            <button onClick={onAddExecutive} className="btn btn-primary">
              Add Executive
            </button>

            <button onClick={onAddEntry} className="btn btn-success">
              + Add Entry
            </button>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="btn btn-secondary"
            >
              {loading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;