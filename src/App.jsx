
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import Login from './Pages/Login';
// import ExecutiveDashboard from './Pages/ExecutiveDashboard';
// import TeamLeadDashboard from './Pages/TeamLeadDashboard';
// import ManagementDashboard from './Pages/ManagementDashboard';

// // Create a custom hook for authentication
// const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user exists in localStorage on app load
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   return { user, login, logout, loading };
// };

// // Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       color: 'white'
//     }}>
//       Loading...
//     </div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     // Redirect to appropriate dashboard based on role
//     return <Navigate to={`/${user.role}`} />;
//   }

//   return children;
// };

// function AppContent() {
//   const { user, login, logout } = useAuth();

//   return (
//     <Routes>
//       <Route path="/login" element={
//         user ? <Navigate to={`/${user.role}`} /> : <Login login={login} />
//       } />
      
      
//       <Route path="/executive" element={
//         <ProtectedRoute allowedRoles={['executive']}>
//           <ExecutiveDashboard user={user} logout={logout} />
//         </ProtectedRoute>
//       } />
      
//       <Route path="/teamlead" element={
//         <ProtectedRoute allowedRoles={['teamlead']}>
//           <TeamLeadDashboard user={user} logout={logout} />
//         </ProtectedRoute>
//       } />
      
//       <Route path="/management" element={
//         <ProtectedRoute allowedRoles={['management']}>
//           <ManagementDashboard user={user} logout={logout} />
//         </ProtectedRoute>
//       } />
      
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Pages/Login";
import ExecutiveDashboard from "./Pages/ExecutiveDashboard";
import TeamLeadDashboard from "./Pages/TeamLeadDashboard";
import ManagementDashboard from "./Pages/ManagementDashboard";

import { authService } from './Services/authservice';

// ✅ Auth Hook
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  // ✅ LOGIN — only updates state (API call is handled in Login.jsx)
  const login = (userData) => {
    setUser(userData);
  };

  // ✅ LOGOUT API
  const logout = async () => {
    console.log('[App] logout() called — calling API...');
    try {
      await authService.logout();
      console.log('[App] Logout API success');
    } catch (error) {
      // API failed — log it but still clear local session
      console.log('[App] Logout API error (continuing with local logout):', error);
    } finally {
      // Always clear local state regardless of API result
      setUser(null);
      localStorage.removeItem("user");
      console.log('[App] Local session cleared — redirecting to /login');
      window.location.href = "/login";
    }
  };

  return { user, login, logout, loading };
};

// ✅ Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(storedUser.role)) {
    return <Navigate to={`/${storedUser.role}`} />;
  }

  return children;
};

function AppContent() {
  const { user, login, logout, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={`/${user.role}`} />
          ) : (
            <Login login={login} />
          )
        }
      />

      {/* EXECUTIVE */}
      <Route
        path="/executive"
        element={
          <ProtectedRoute allowedRoles={["executive"]}>
            <ExecutiveDashboard user={user} logout={logout} />
          </ProtectedRoute>
        }
      />

      {/* TEAMLEAD */}
      <Route
        path="/teamlead"
        element={
          <ProtectedRoute allowedRoles={["teamlead"]}>
            <TeamLeadDashboard user={user} logout={logout} />
          </ProtectedRoute>
        }
      />

      {/* MANAGEMENT */}
      <Route
        path="/management"
        element={
          <ProtectedRoute allowedRoles={["management"]}>
            <ManagementDashboard user={user} logout={logout} />
          </ProtectedRoute>
        }
      />

      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
