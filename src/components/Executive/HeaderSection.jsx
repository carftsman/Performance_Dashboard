import React from 'react';
import './HeaderSection.css';

const HeaderSection = ({ executive, onBack }) => {
  return (
    <header className="workview-header">
      <div className="header-container">
        <button 
          onClick={onBack} 
          className="back-btn"
          aria-label="Back to team"
          title="Back to team"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="executive-info">
          <h1 className="executive-name">{executive.name}</h1>
          <div className="executive-meta">
            <span className="id-badge">ID: {executive.id}</span>
            <span className="status-indicator">Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;