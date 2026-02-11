import React from 'react';

const ViewToggle = ({ period, onChange }) => {
  const periods = [
    { value: 'daily', label: 'Day View', icon: '📅' },
    { value: 'weekly', label: 'Week View', icon: '📆' },
    { value: 'monthly', label: 'Month View', icon: '🗓️' }
  ];

  return (
    <div className="card">
      <h2 className="card-title">Select View</h2>
      <div className="tabs">
        {periods.map(p => (
          <button
            key={p.value}
            className={`tab ${period === p.value ? 'active' : ''}`}
            onClick={() => onChange(p.value)}
          >
            <span style={{ marginRight: '8px' }}>{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', color: '#666' }}>
        {period === 'daily' && 'Viewing today\'s performance and entry'}
        {period === 'weekly' && 'Viewing weekly aggregated performance'}
        {period === 'monthly' && 'Viewing monthly aggregated performance'}
      </div>
    </div>
  );
};

export default ViewToggle;