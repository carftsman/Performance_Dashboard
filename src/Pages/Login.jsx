
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../Services/api';// ✅ Import your axios instance

// const Login = ({ login }) => {
//   const [userCode, setUserCode] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('executive'); // UI kept same
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // ✅ LOGIN SUBMIT FUNCTION
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     // Basic validation
//     if (!userCode || !password) {
//       setError('Please enter both User Code and Password');
//       return;
//     }

//     try {
//       // ✅ API CALL
//       const response = await api.post('/api/auth/login', {
//         userCode: userCode,
//         password: password,
//       });

//       console.log("Login Response:", response);

//       // ✅ Save user info
//       const loggedUser = {
//         userCode: response.userCode,
//         role: response.role,
//       };

//       localStorage.setItem("user", JSON.stringify(loggedUser));

//       // ✅ Call parent login()
//       login(loggedUser);

//       // ✅ Navigate based on backend role
//       navigate(`/${response.role.toLowerCase()}`);

//     } catch (err) {
//       console.log("Login Error:", err);
//       setError(err.message || "Login Failed");
//     }
//   };

   
//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="login-header">
//           <h1>Performance Tracking System</h1>
//         </div>

//         {/* ✅ ERROR MESSAGE */}
//         {error && (
//           <p style={{ color: "red", textAlign: "center" }}>
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSubmit}>
          
//           {/* UI ROLE DROPDOWN (Same as before) */}
//           <div className="form-group">
//             <label>Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="input-field"
//             >
//               <option value="selectRole">Select Role</option>
//               <option value="executive">Executive</option>
//               <option value="BPO">BPO</option>
//               <option value="teamlead">Team Lead</option>
//               <option value="management">Management</option>
//               <option value="Admin">Admin</option>
//               <option value="DA">Data Analyst</option>
//             </select>
//           </div>

//           {/* ✅ USER CODE FIELD (Replaces Email) */}
//           <div className="form-group">
//             <label>User Code</label>
//             <input
//               type="text"
//               value={userCode}
//               onChange={(e) => setUserCode(e.target.value)}
//               className="input-field"
//               placeholder="Enter your User Code"
//               required
//             />
//           </div>

//           {/* PASSWORD FIELD (Same) */}
//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="input-field"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-block">
//             Login to Dashboard
//           </button>
//         </form>

//         {/* Quick Login Removed because no mock allowed */}
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../Services/authservice";

const Login = ({ login }) => {
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Keep Role Dropdown
  const [role, setRole] = useState("selectRole");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ LOGIN FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!userCode || !password) {
      setError("Please enter both User Code and Password");
      setLoading(false);
      return;
    }

    if (role === "selectRole") {
      setError("Please select a role");
      setLoading(false);
      return;
    }

    try {
      // ✅ API CALL via authService
      const response = await authService.login({ userCode, password });

      console.log("Login Response:", response);

      // Backend role: EXECUTIVE
      const backendRole = response.role.toLowerCase();

      // ✅ Check role mismatch
      if (backendRole !== role.toLowerCase()) {
        setError(
          `Role mismatch! You selected "${role}" but backend says "${backendRole}".`
        );
        setLoading(false);
        return;
      }

      // ✅ Save user
      const loggedUser = {
        userCode: response.userCode,
        role: backendRole,
      };

      localStorage.setItem("user", JSON.stringify(loggedUser));

      // Update App State
      login(loggedUser);

      // Redirect
      navigate(`/${backendRole}`);
    } catch (err) {
      // Log full error details for debugging
      console.log("Login Error (full):", err);
      console.log("Status:", err.response?.status);
      console.log("Server response body:", err.response?.data);

      // Extract the real server message (not the generic AxiosError string)
      const serverError = err.response?.data;
      const errorMessage =
        serverError?.message ||
        serverError?.error ||
        serverError?.detail ||
        (typeof serverError === "string" ? serverError : null) ||
        "Invalid credentials. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        {/* Header / Branding */}
        <div className="login-header">
          {/* <div className="login-logo">📊</div> */}
          <h1>Performance Tracking System</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="login-error">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* ROLE DROPDOWN */}
          <div className="form-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            >
              <option value="selectRole">Select Role</option>
              <option value="executive">Executive</option>
              <option value="teamlead">Team Lead</option>
              <option value="manager">Manager</option>
              <option value="bpo">BPO</option>
              <option value="admin">Admin</option>
              <option value="reporter">Data Analyst</option>
            </select>
          </div>

          {/* USER CODE */}
          <div className="form-group">
            <label>User Code</label>
            <input
              type="text"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="input-field"
              placeholder="Enter User Code (Ex: ITS115)"
              required
              autoComplete="username"
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter Password"
              required
              autoComplete="current-password"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn btn-block login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="login-btn-loading">
                <span className="login-spinner"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
