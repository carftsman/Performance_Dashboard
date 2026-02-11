// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import { AuthProvider } from './context/AuthContext';
// // import ProtectedRoute from './routes/ProtectedRoute';
// // import Login from './Pages/Login';
// // import ExecutiveDashboard from './Pages/ExecutiveDashboard';
// // import TeamLeadDashboard from './Pages/TeamLeadDashboard';
// // import ManagementDashboard from './Pages/ManagementDashboard';
// // import NotFound from './Pages/NotFound';

// // function App() {
// //   return (
// //     <Router>
// //       <AuthProvider>
// //         <Routes>
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/executive" element={
// //             <ProtectedRoute allowedRoles={['executive']}>
// //               <ExecutiveDashboard />
// //             </ProtectedRoute>
// //           } />
// //           <Route path="/teamlead" element={
// //             <ProtectedRoute allowedRoles={['teamlead']}>
// //               <TeamLeadDashboard />
// //             </ProtectedRoute>
// //           } />
// //           <Route path="/management" element={
// //             <ProtectedRoute allowedRoles={['management']}>
// //               <ManagementDashboard />
// //             </ProtectedRoute>
// //           } />
// //           <Route path="/" element={<Navigate to="/login" />} />
// //           <Route path="*" element={<NotFound />} />
// //         </Routes>
// //       </AuthProvider>
// //     </Router>
// //   );
// // }

// // export default App;
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './Pages/Login';
// import ExecutiveDashboard from './Pages/ExecutiveDashboard';
// import TeamLeadDashboard from './Pages/TeamLeadDashboard';
// import ManagementDashboard from './Pages/ManagementDashboard'

// // Mock auth context
// const AuthContext = React.createContext();

// function App() {
//   const [user, setUser] = useState(null);

//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/executive" element={
//             user ? <ExecutiveDashboard user={user} /> : <Navigate to="/login" />
//           } />
//           <Route path="/teamlead" element={
//             user ? <TeamLeadDashboard user={user} /> : <Navigate to="/login" />
//           } />
//           <Route path="/management" element={
//             user ? <ManagementDashboard user={user} /> : <Navigate to="/login" />
//           } />
//           <Route path="/" element={<Navigate to="/login" />} />
//         </Routes>
//       </Router>
//     </AuthContext.Provider>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Pages/Login';
import ExecutiveDashboard from './Pages/ExecutiveDashboard';
import TeamLeadDashboard from './Pages/TeamLeadDashboard';
import ManagementDashboard from './Pages/ManagementDashboard';

// Create a custom hook for authentication
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, login, logout, loading };
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      Loading...
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={`/${user.role}`} />;
  }

  return children;
};

function AppContent() {
  const { user, login, logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to={`/${user.role}`} /> : <Login login={login} />
      } />
      
      <Route path="/executive" element={
        <ProtectedRoute allowedRoles={['executive']}>
          <ExecutiveDashboard user={user} logout={logout} />
        </ProtectedRoute>
      } />
      
      <Route path="/teamlead" element={
        <ProtectedRoute allowedRoles={['teamlead']}>
          <TeamLeadDashboard user={user} logout={logout} />
        </ProtectedRoute>
      } />
      
      <Route path="/management" element={
        <ProtectedRoute allowedRoles={['management']}>
          <ManagementDashboard user={user} logout={logout} />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;