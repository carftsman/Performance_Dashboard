import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children, user, logout }) => {
  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('user');
    }
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <Sidebar user={user} />
      
      <div className="main-content">
        <div className="header">
          <h1>Field Marketing Tracking System</h1>
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div><strong>{user?.name}</strong></div>
              <div style={{ fontSize: '12px', color: '#666' }}>{user?.email}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default MainLayout;