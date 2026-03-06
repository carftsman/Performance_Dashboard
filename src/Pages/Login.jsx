
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../Services/authservice";
import "./Login.css";
import logo1 from "../assets/logo1.png";
 import {toast } from "react-toastify";
/* ─── Eye Icon ─────────────────────────────────────────── */
const EyeIcon = ({ visible }) =>
  visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
 
/* ─── Password Input with Eye Toggle ───────────────────── */
const PasswordInput = ({ id, value, onChange, placeholder, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="password-wrapper">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="input-field"
        placeholder={placeholder}
        required
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="eye-btn"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        <EyeIcon visible={show} />
      </button>
    </div>
  );
};
 
/* ─── Main Component ────────────────────────────────────── */
const Login = ({ login }) => {
  const navigate = useNavigate();
 
  /* ── Shared fields ── */
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("selectRole");
 
  /* ── Activate-only fields ── */
  const [confirmPassword, setConfirmPassword] = useState("");
 
  /* ── UI state ── */
  const [isActivateMode, setIsActivateMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
 // Forgot password states
const [isForgotMode, setIsForgotMode] = useState(false);
const [otp, setOtp] = useState("");
const [isOtpVerified, setIsOtpVerified] = useState(false);
const [otpSent, setOtpSent] = useState(false);

  const roles = [
    { value: "executive", label: "Executive" },
    { value: "teamlead", label: "Team Lead" },
    { value: "manager", label: "Manager" },
    { value: "bpo", label: "BPO" },
    { value: "admin", label: "Admin" },
    { value: "reporter", label: "Data Analyst" },
  ];
 
  const currentRoleLabel =
    role === "selectRole"
      ? "Select Role"
      : roles.find((r) => r.value === role.toLowerCase())?.label || "Select Role";
 
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  /* ──────────── Helpers ──────────── */
  const resetMessages = () => {
    setError("");
    setSuccessMsg("");
  };
 
  const switchMode = () => {
    resetMessages();
    setUserCode("");
    setPassword("");
    setConfirmPassword("");
    setRole("selectRole");
    setIsActivateMode((m) => !m);
  };
 
  /* ──────────── LOGIN ──────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
 
    if (!userCode.trim() || !password) {
      return setError("Please enter both User Code and Password.");
    }
    if (role === "selectRole") {
      return setError("Please select a role.");
    }
 
    setLoading(true);
    try {
      const response = await authService.login({ userCode: userCode.trim(), password });
      console.log("Login Response:", response);
 
      const backendRole = response.role?.toLowerCase();
 
      if (backendRole !== role.toLowerCase()) {
        setLoading(false);
        return setError(
          `Role mismatch! You selected "${role}" but your account role is "${backendRole}".`
        );
      }
 
      const loggedUser = {
        userCode: response.userCode,
        role: backendRole,
        name: response.name,
      };
 
      localStorage.setItem("user", JSON.stringify(loggedUser));
      login(loggedUser);
      navigate(`/${backendRole}`);
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
 
  /* ──────────── ACTIVATE ──────────── */
  const handleActivate = async (e) => {
    e.preventDefault();
    resetMessages();
 
    // --- Client-side validation ---
    if (!userCode.trim()) return setError("User Code is required.");
    if (!password) return setError("Password is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
 
    setLoading(true);
    try {
      const response = await authService.activate({
        userCode: userCode.trim(),
        password,
        confirmPassword,
      });
 
      // --- Success ---
      // The API may return a message field, or just an empty 200/201
      const successText =
        response?.message ||
        "Account activated successfully! You can now log in.";
 
      setSuccessMsg(successText);
      setUserCode("");
      setPassword("");
      setConfirmPassword("");
 
      // Switch back to login after a short delay
      setTimeout(() => {
        resetMessages();
        setIsActivateMode(false);
      }, 2500);
 
    } catch (err) {
      console.error("Activate Error:", err);
 
      // err now has { message, status, data } from the updated interceptor
      const status = err.status;
      const data = err.data;
 
      // --- Map known status codes to helpful messages ---
      if (status === 409) {
        // Conflict: already activated / credentials already exist
        setError(
          err.message ||
          "This account has already been activated. Please log in instead."
        );
      } else if (status === 400) {
        // Bad request — server-level validation failure
        setError(
          err.message ||
          data?.errors?.[0] ||
          "Invalid input. Please check your details and try again."
        );
      } else if (status === 404) {
        // User code not found in the system
        setError(
          err.message ||
          "User code not found. Please check and try again."
        );
      } else if (status === 500) {
        // Server error: try to show a specific reason if the server sent one
        setError(
          err.message ||
          "A server error occurred. This may mean the account is already activated, or the credentials are invalid."
        );
      } else {
        // Fallback for anything unexpected
        setError(err.message || "Activation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
// otp 
const handleGenerateOtp = async (e) => {
  e.preventDefault();
  resetMessages();

  if (!userCode.trim()) {
    return setError("User Code is required.");
  }

  setLoading(true);
  try {
    const response = await authService.forgotPassword({
      userCode: userCode.trim(),
    });

    // Backend returns: "OTP: 292493"
    const otpValue = response;
    setOtp(otpValue.slice(5,11))

    toast.info(otpValue); // ✅ Show OTP in alert popup

    setOtpSent(true);
    setSuccessMsg("OTP sent successfully.");
  } catch (err) {
    setError(err.message || "Failed to generate OTP.");
  } finally {
    setLoading(false);
  }
};
//verify otp
const handleVerifyOtp = () => {
  if (!otp.trim()) {
    return setError("Please enter OTP.");
  }

  setIsOtpVerified(true);
  setSuccessMsg("OTP verified successfully. You can now set a new password.");
  setError("");
};
//  reset password

const handleResetPassword = async (e) => {
  e.preventDefault();
  resetMessages();

  if (!otp) return setError("OTP is required.");
  if (!password) return setError("New password is required.");
  if (password.length < 6)
    return setError("Password must be at least 6 characters.");
  if (password !== confirmPassword)
    return setError("Passwords do not match.");

  setLoading(true);
  try {
    await authService.resetPassword({
      token: otp,
      newPassword: password,
      confirmPassword,
    });

    setSuccessMsg("Password reset successful! Redirecting to login...");

    setTimeout(() => {
      setIsForgotMode(false);
      setUserCode("");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setOtpSent(false);
      setIsOtpVerified(false);
      navigate("/");
    }, 2000);
  } catch (err) {
    setError(err.message || "Password reset failed.");
  } finally {
    setLoading(false);
  }
};
  /* ──────────── Render ──────────── */
  return (
    <div className="login-container">
      <div className="login-box">
 
        {/* Header */}
        <div className="login-header">
          <img src={logo1} alt="Dhatvi Business Solutions" className="login-logo" />
          <h1>Performance Tracking System</h1>
          <p className="login-subtitle">
            {isActivateMode ? "Activate your account to get started." : "Sign in to your account."}
          </p>
        </div>
 
        {/* Alert Messages */}
        {error && (
          <div className="login-alert login-alert--error" role="alert">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div className="login-alert login-alert--success" role="status">
            ✅ {successMsg}
          </div>
        )}
 
        {/* ── LOGIN FORM ── */}
        {!isActivateMode && !isForgotMode &&  (
          <form onSubmit={handleLogin} noValidate>
            {/* Role */}
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <div className="custom-dropdown" ref={dropdownRef}>
                <div
                  className={`custom-dropdown-trigger ${isDropdownOpen ? "is-open" : ""}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={role === "selectRole" ? "placeholder-text" : ""}>
                    {currentRoleLabel}
                  </span>
                  <span className="dropdown-arrow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="custom-dropdown-options">
                    <div
                      className="custom-dropdown-option placeholder"
                      onClick={() => {
                        setRole("selectRole");
                        setIsDropdownOpen(false);
                      }}
                    >
                      Select Role
                    </div>
                    {roles.map((r) => (
                      <div
                        key={r.value}
                        className={`custom-dropdown-option ${role.toLowerCase() === r.value ? "selected" : ""}`}
                        onClick={() => {
                          setRole(r.value);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {r.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
 
            {/* User Code */}
            <div className="form-group">
              <label htmlFor="login-usercode">User Code</label>
              <input
                id="login-usercode"
                type="text"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="input-field"
                placeholder="e.g. ITS115"
                required
                autoComplete="username"
              />
            </div>
 
            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <PasswordInput
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                autoComplete="current-password"
              />
            </div>
 
            <button
              type="submit"
              className="btn-primary-action"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="login-spinner" /> Logging in…
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        )}
 
        {/* ── ACTIVATE FORM ── */}
        {isActivateMode && !isForgotMode && (
          <form onSubmit={handleActivate} noValidate>
            {/* User Code */}
            <div className="form-group">
              <label htmlFor="act-usercode">User Code</label>
              <input
                id="act-usercode"
                type="text"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="input-field"
                placeholder="e.g. ITS115"
                required
                autoComplete="username"
              />
            </div>
 
            {/* Password */}
            <div className="form-group">
              <label htmlFor="act-password">Password</label>
              <PasswordInput
                id="act-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min 6 chars)"
                autoComplete="new-password"
              />
            </div>
 
            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="act-confirm">Confirm Password</label>
              <PasswordInput
                id="act-confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>
 
            <button
              type="submit"
              className="btn-activate-action"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="login-spinner" /> Activating…
                </span>
              ) : (
                "Activate Account"
              )}
            </button>
          </form>
          
        )}

        {/* ── FORGOT PASSWORD FORM ── */}
{isForgotMode && (
  <form onSubmit={handleResetPassword} noValidate>

    {/* User Code */}
    {!otpSent && (
      <>
        <div className="form-group">
          <label>User Code</label>
          <input
            type="text"
            className="input-field"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="Enter your User Code"
            required
          />
        </div>

        <button
          type="button"
          className="btn-primary-action"
          onClick={handleGenerateOtp}
          disabled={loading}
        >
          {loading ? "Generating OTP..." : "Generate OTP"}
        </button>
      </>
    )}

    {/* OTP + Reset Section */}
    {otpSent && (
      <>
        <div className="form-group">
          <label>Enter OTP</label>
          <input
            type="text"
            className="input-field"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <PasswordInput
            id="forgot-new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={!otp}   // ✅ Disabled until OTP entered
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <PasswordInput
            id="forgot-confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            disabled={!otp}   // ✅ Disabled until OTP entered
          />
        </div>

        <button
          type="submit"
          className="btn-primary-action"
          disabled={loading || !otp}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </>
    )}
  </form>
)}
        
 
        {/* ── Toggle Link ── */}
       <div className="login-footer">
  {isForgotMode ? (
  <p>
    Back to{" "}
    <button
      type="button"
      className="link-btn"
      onClick={() => {
        setIsForgotMode(false);
        resetMessages();
      }}
    >
      Login
    </button>
  </p>
) : isActivateMode ? (
    <p>
      Already activated?{" "}
      <button type="button" className="link-btn" onClick={switchMode}>
        Back to Login
      </button>
    </p>
  ) : (
    <>
      <p>
        New user?{" "}
        <button type="button" className="link-btn" onClick={switchMode}>
          Activate Account
        </button>
      </p>

      <p style={{ marginTop: "6px" }}>
        Forgot password?{" "}
        <button
          type="button"
          className="link-btn"
         onClick={() => {
  resetMessages();
  setIsActivateMode(false);   // ✅ close activate
  setIsForgotMode(true);      // ✅ open forgot
  setUserCode("");
  setPassword("");
  setConfirmPassword("");
  setOtp("");
  setOtpSent(false);
  setIsOtpVerified(false);
}}
        >
          Reset Here
        </button>
      </p>
    </>
  )}
  
</div>
 
      </div>
    </div>
  );
};
 
export default Login;