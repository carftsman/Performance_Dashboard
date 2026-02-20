import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const location = useLocation();
  
  const menuItems = {
    // teamlead: [
    //   { path: '/teamlead', icon: '👥', label: 'Team Overview' },
    // ],
    executive: [
      { path: '/executive', icon: '📝', label: 'Daily Entry' },
      { path: '/executive/history', icon: '📋', label: 'My History' }
    ],
    management: [
      { path: '/management', icon: '🏢', label: 'Dashboard' },
      { path: '/management/reports', icon: '📈', label: 'Reports' }
    ]
  };

  const currentMenu = menuItems[user?.role] || [];

  // Get user display name from userCode if name is not available
  const displayName = user?.name || user?.userCode || 'User';
  const userRole = user?.role || 'guest';

  return (
    <div className="sidebar" style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#2c3e50',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Logo/Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #34495e',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: 0, color: 'white' }}>Field Marketing</h3>
        <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#95a5a6' }}>
          Tracking System
        </p>
      </div>

      {/* Navigation Menu */}
      <div className="nav-menu" style={{ flex: 1, padding: '20px 0' }}>
        {currentMenu.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              color: location.pathname === item.path ? 'white' : '#bdc3c7',
              textDecoration: 'none',
              backgroundColor: location.pathname === item.path ? '#34495e' : 'transparent',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor = '#34495e';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#bdc3c7';
              }
            }}
          >
            <span className="nav-icon" style={{ marginRight: '10px', fontSize: '18px' }}>
              {item.icon}
            </span>
            <span style={{ fontSize: '14px' }}>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Info Section */}
      <div style={{ 
        padding: '20px', 
        borderTop: '1px solid #34495e',
        backgroundColor: '#243342'
      }}>
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
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '12px', color: '#95a5a6', textTransform: 'capitalize' }}>
              {userRole}
            </div>
            {user?.userCode && (
              <div style={{ fontSize: '10px', color: '#7f8c8d', marginTop: '2px' }}>
                ID: {user.userCode}
              </div>
            )}
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default Sidebar;