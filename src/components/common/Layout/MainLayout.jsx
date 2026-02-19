import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children, user, logout }) => {
  const handleLogout = async () => {
    console.log('[MainLayout] Logout button clicked');
    console.log('[MainLayout] logout prop received:', typeof logout);
    if (logout) {
      // logout() is async — await it so App.jsx handles clearing state + redirect
      await logout();
    } else {
      // fallback if logout prop not passed
      console.log('[MainLayout] No logout prop — fallback: clearing localStorage');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
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