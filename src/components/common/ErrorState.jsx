import React from 'react';
// import './ErrorState.css';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="error-container card">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Oops! Something went wrong</h3>
      <p className="error-message">{message}</p>
      <button onClick={onRetry} className="btn btn-danger">
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;