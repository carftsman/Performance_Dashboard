import React ,{useState} from "react";

const DashboardHeader = ({
  dashboardUser,
  loading,
  onAddExecutive,
  onAddEntry,
  onRefresh,
  setWorkStarted,
  locationAllowed,
  setLocationAllowed,
  workStarted,
  setWorkStartLocation,
  showForm,
}) => {

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
         onAddEntry(); 
      },
      () => alert("Unable to fetch start location")
    );
  };
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

.exec-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: none;
  border-radius: 7px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  line-height: 1;
}

.exec-btn--location {
  background: rgba(227, 31, 31, 0.18);
  color: black;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.exec-btn--location:hover:not(:disabled) {
  background: rgba(238, 25, 25, 0.28);
}
.exec-btn--location:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.exec-btn--start {
  background: #22c55e;
  color: #fff;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.35);
}
.exec-btn--start:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-1px);
}
.exec-btn--start:disabled {
  background: rgba(255, 255, 255, 0.2);
  color: black;
  cursor: not-allowed;
  box-shadow: none;
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
              onClick={() =>onAddEntry()}
            >
              + New Entry
            </button>
          )}


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