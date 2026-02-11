// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = ({ user }) => {
//   const location = useLocation();
  
//   const menuItems = {
//     executive: [
//       { path: '/executive', icon: '📊', label: 'Dashboard' },
//       { path: '/executive/daily', icon: '📝', label: 'Daily Entry' },
//       { path: '/executive/reports', icon: '📋', label: 'Reports' }
//     ],
//     teamlead: [
//       { path: '/teamlead', icon: '👥', label: 'Team Overview' },
//       { path: '/teamlead/performance', icon: '📈', label: 'Performance' },
//       { path: '/teamlead/reports', icon: '📊', label: 'Reports' }
//     ],
//     management: [
//       { path: '/management', icon: '🏢', label: 'Dashboard' },
//       { path: '/management/teams', icon: '👥', label: 'Team View' },
//       { path: '/management/executives', icon: '👤', label: 'Executive View' },
//       { path: '/management/reports', icon: '📈', label: 'Analytics' }
//     ]
//   };

//   const currentMenu = menuItems[user?.role] || [];

//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <h2>FieldTrack</h2>
//         <p>v1.0</p>
//       </div>
      
//       <div className="nav-menu">
//         {currentMenu.map(item => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
//           >
//             <span className="nav-icon">{item.icon}</span>
//             <span>{item.label}</span>
//           </Link>
//         ))}
        
//         <div style={{ padding: '20px' }}>
//           <div className="user-avatar">
//             {user?.name?.charAt(0) || 'U'}
//           </div>
//           <div style={{ marginTop: '10px' }}>
//             <strong>{user?.name}</strong>
//             <div style={{ fontSize: '12px', color: '#666' }}>
//               {user?.role?.toUpperCase()}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Sidebar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const location = useLocation();
  
  const menuItems = {
    executive: [
      { path: '/executive', icon: '📊', label: 'Dashboard' }
    ],
    teamlead: [
      { path: '/teamlead', icon: '👥', label: 'Team Overview' }
    ],
    management: [
      { path: '/management', icon: '🏢', label: 'Dashboard' }
    ]
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>FieldTrack</h2>
        <p>v1.0</p>
      </div>
      
      <div className="nav-menu">
        {currentMenu.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        
        <div style={{ padding: '20px', borderTop: '1px solid #eee', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>{user?.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {user?.role?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;