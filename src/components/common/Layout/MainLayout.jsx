import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

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
    <div className="dashboard" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar user={user} />
      
      <div className="main-content" style={{
        flex: 1,
        marginLeft: '250px',
        backgroundColor: '#f5f6fa',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div className="header" style={{
          backgroundColor: 'white',
          padding: '15px 30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
            Field Marketing Tracking System
          </h1>
          
          <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="user-avatar" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>
                  {userRole}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;