import React from 'react';
import './HeaderSection.css';
import BackButton from './BackButton';

const HeaderSection = ({ executive, onBack }) => {
  return (
    <header className="workview-header">
      <div className="header-container">
        <BackButton onClick={onBack} />

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