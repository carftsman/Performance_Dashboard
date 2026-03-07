import React from 'react';
import { FiUsers, FiLayers, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import DateFilter from './DateFilter';
import './TeamSummary.css';

const TeamSummary = ({ 
  executives, 
  totalForms, 
  successfulForms, 
  notInterestedForms,
  dateFilter,
  onDateFilterChange,
  onClearDateFilters
}) => {
  const stats = [
    {
      label: 'Active Executives',
      value: executives.length,
      icon: <FiUsers />,
      variant: 'executives'
    },
    {
      label: 'Total Forms',
      value: totalForms,
      icon: <FiLayers />,
      variant: 'total'
    },
    {
      label: 'Interested',
      value: successfulForms,
      icon: <FiCheckCircle />,
      variant: 'success'
    },
    {
      label: 'Not Interested',
      value: notInterestedForms,
      icon: <FiXCircle />,
      variant: 'not-interested'
    }
  ];

  return (
    <div className="ts-summary-section">
      <div className="ts-summary-header">
        <h3 className="ts-summary-title">Team Summary</h3>
        <DateFilter
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
          onClearFilters={onClearDateFilters}
        />
      </div>

      <div className="ts-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`ts-stat-card ts-stat-card--${stat.variant}`}>
            <div className="ts-stat-icon">
              {stat.icon}
            </div>
            <div className="ts-stat-info">
              <div className="ts-stat-value">
                {stat.value}
              </div>
              <div className="ts-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSummary;