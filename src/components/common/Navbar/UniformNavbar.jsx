import React, { useState, useEffect } from "react";
import "./UniformNavbar.css";
import logo from "../../../assets/logo.png";

const UniformNavbar = ({
  user,
  role = "User",
  locationAllowed,
  workStarted,
  loading,
  showForm,
  onRefresh,
  onEnableLocation,
  onStartWork,
  onAddExecutive,
  onAddEntry,
  logout,
  approvedRequestsCount = 0,
  onShowApprovedRequests,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".navbar-profile-container")) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileDrawer = () => setIsMobileDrawerOpen(!isMobileDrawerOpen);

  const displayName = user?.userCode || user?.name || "User";

  return (
    <nav className="uniform-navbar">
      {/* ── DESKTOP & MOBILE LEFT: LOGO / BRAND DROPDOWN ── */}
      <div className="navbar-left">
        <button 
          className="mobile-hamburger" 
          onClick={toggleMobileDrawer}
          aria-label="Toggle Menu"
        >
          ☰
        </button>

        <div className="navbar-profile-container">
          <div 
            className="navbar-brand clickable-desktop" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img src={logo} alt="Logo" className="navbar-logo" />
            <div className="navbar-brand-info">
              <div className="navbar-brand-text">{displayName}</div>
              <div className="navbar-brand-sub">{role}</div>
            </div>
            <span className={`brand-dropdown-arrow desktop-only ${isProfileOpen ? 'open' : ''}`}>▾</span>
          </div>

          {isProfileOpen && (
            <div className="navbar-dropdown left-dropdown desktop-only">
              <div className="dropdown-header">
                <strong>{displayName}</strong>
                <span>{role}</span>
              </div>
              <hr />
              
              {/* Primary Actions Moved Here for Desktop */}
              {!workStarted && (
                <button
                  className="dropdown-item"
                  disabled={!locationAllowed}
                  onClick={() => { onStartWork(); setIsProfileOpen(false); }}
                >
                  ▶ Start Work
                </button>
              )}

              {workStarted && !showForm && onAddEntry && (
                <button className="dropdown-item" onClick={() => { onAddEntry(); setIsProfileOpen(false); }}>
                  + New Entry
                </button>
              )}

              {onShowApprovedRequests && (
                <button 
                  className="dropdown-item"
                  onClick={() => { onShowApprovedRequests(); setIsProfileOpen(false); }}
                >
                  📋 Approved Requests {approvedRequestsCount > 0 ? `(${approvedRequestsCount})` : ''}
                </button>
              )}

              {role === "Team Lead" && onAddExecutive && (
                <button 
                  onClick={() => { onAddExecutive(); setIsProfileOpen(false); }} 
                  className="dropdown-item"
                >
                  👥 Add Executive
                </button>
              )}

              <hr />
              <button className="dropdown-item logout" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP ONLY: RIGHT ACTIONS (STATUS & REFRESH ONLY) ── */}
      <div className="navbar-center-right desktop-only">
        <div 
          className={`location-status ${locationAllowed ? "enabled" : "disabled"}`}
          onClick={!locationAllowed ? onEnableLocation : undefined}
          title={locationAllowed ? "Location Enabled" : "Click to Enable Location"}
        >
          <span className="status-dot"></span>
          <span className="status-text">
            {locationAllowed ? "Location Enabled" : "Location Disabled"}
          </span>
        </div>

        <button 
          onClick={onRefresh} 
          disabled={loading} 
          className="navbar-btn-icon"
          title="Refresh Data"
        >
          {loading ? <span className="navbar-spinner"></span> : "🔄"}
        </button>
      </div>

      {/* ── MOBILE ONLY: START WORK BUTTON ── */}
      <div className="navbar-mobile-right mobile-only">
        {!workStarted && (
          <button
            className="navbar-btn btn--primary mini"
            disabled={!locationAllowed}
            onClick={onStartWork}
          >
            ▶ Start
          </button>
        )}
        {workStarted && !showForm && onAddEntry && (
          <button className="navbar-btn btn--primary mini" onClick={onAddEntry}>
            + Entry
          </button>
        )}
      </div>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {isMobileDrawerOpen && (
        <>
          <div className="drawer-overlay" onClick={toggleMobileDrawer}></div>
          <div className="mobile-drawer">
            <div className="drawer-header">
              <div className="navbar-brand">
                <img src={logo} alt="Logo" className="navbar-logo" />
                <div className="navbar-brand-info">
                  <div className="navbar-brand-text">{displayName}</div>
                  <div className="navbar-brand-sub">{role}</div>
                </div>
              </div>
              <button className="drawer-close" onClick={toggleMobileDrawer}>×</button>
            </div>
            
            <div className="drawer-body">
              {role === "Team Lead" && onAddExecutive && (
                <button 
                  onClick={() => { onAddExecutive(); toggleMobileDrawer(); }} 
                  className="drawer-item"
                >
                  👥 Add Executive
                </button>
              )}

              <div 
                className={`drawer-item location-status ${locationAllowed ? "enabled" : "disabled"}`}
                onClick={() => { if(!locationAllowed) onEnableLocation(); }}
              >
                <span className="status-dot"></span>
                <span>{locationAllowed ? "Location Enabled" : "Enable Location"}</span>
              </div>

              {onShowApprovedRequests && (
                <button 
                  onClick={() => { onShowApprovedRequests(); toggleMobileDrawer(); }} 
                  className="drawer-item"
                >
                  📋 Approved Requests ({approvedRequestsCount})
                </button>
              )}

              <button 
                onClick={() => { onRefresh(); toggleMobileDrawer(); }} 
                className="drawer-item"
                disabled={loading}
              >
                🔄 Refresh Data
              </button>

              <hr />

              <button className="drawer-item logout" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default UniformNavbar;
