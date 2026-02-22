import React from 'react';
// import './LoadingState.css';

const LoadingState = () => {
  return (
    <div className="loading-container card">
      <div className="loader-spinner"></div>
      <h3 className="loading-text">Loading team data...</h3>
      <p className="loading-subtext">Please wait while we fetch the latest information</p>
    </div>
  );
};

export default LoadingState;