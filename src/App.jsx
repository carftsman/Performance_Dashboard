
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
import BpoDashBoard from "./Pages/BpoDashboard";
import ManagementDashboard from "./Pages/ManagementDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import ReportDashboard from "./Pages/ReportDashboard";
import BpoHistory from "./Pages/BpoHistory";
const authService = React.lazy(()=>import('./Services/authservice'));
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
     
          <Route path="/login" element={
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
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagementDashboard user={user} logout={logout} />
          </ProtectedRoute>
        }
      />
       {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard user={user} logout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reporter"
        element={
          <ProtectedRoute allowedRoles={["reporter"]}>
            <ReportDashboard user={user} logout={logout} />
          </ProtectedRoute>
        }
      />
      {/* Bpo  */}
      <Route
        path="/bpo"
        element={
          <ProtectedRoute allowedRoles={["bpo"]}>
            <BpoDashBoard user={user} logout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
  path="/bpo-history"
  element={
    <ProtectedRoute allowedRoles={["bpo"]}>
      <BpoHistory user={user} logout={logout} />
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
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <AppContent />
    </Router>
  );
}
