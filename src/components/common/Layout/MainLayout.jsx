import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ children, user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('[MainLayout] Logout button clicked');
    
    if (logout) {
      try {
        await logout();
        // Navigation will be handled by App.js
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback if logout fails
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else {
      // fallback if logout prop not passed
      console.log('[MainLayout] No logout prop — fallback: clearing localStorage');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  // Get user display info from the user object (which comes from API)
  const displayName = user?.userCode || user?.name || 'User';
  const userEmail = user?.email || `${user?.userCode}@company.com` || 'user@company.com';
  const userRole = user?.role || 'guest';

  return (
    <div className="dashboard-container">
      <div className="main-content">
        {/* Header */}
        <div className="top-header">
          <h1 className="header-title">
            Field Marketing Tracking System
          </h1>
          
          <div className="header-actions">
            <button 
              onClick={handleLogout} 
              className="btn-logout"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;