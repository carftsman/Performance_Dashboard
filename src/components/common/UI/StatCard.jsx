import React from 'react';

const StatCard = ({ title, value, label, color = 'neutral', icon }) => {
  const colorClasses = {
    positive: 'stat-positive',
    negative: 'stat-negative',
    neutral: 'stat-neutral'
  };

  return (
    <div className="stat-card">
      {icon && <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>}
      <div className={`stat-value ${colorClasses[color]}`}>{value}</div>
      <div className="stat-label">{label}</div>
      {title && <div style={{ marginTop: '10px', fontWeight: '500' }}>{title}</div>}
    </div>
  );
};

export default StatCard;