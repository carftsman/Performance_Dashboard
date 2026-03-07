import React from "react";
import './DashboardHeader.css';

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
    <div className="card header-card">
      <div className="header-content">
        <div className="header-left">
          <div>
            <h1 className="header-title">
              Team Lead Dashboard
              {dashboardUser?.userCode && (
                <span className="header-user-code"> — {dashboardUser.userCode}</span>
              )}
            </h1>
            <span className="header-subtitle">Team Lead · Field Management</span>
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
              onClick={() => onAddEntry()}
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
  );
};

export default DashboardHeader;