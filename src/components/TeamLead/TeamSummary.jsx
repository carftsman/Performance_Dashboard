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
      icon: '👥',
      colorClass: 'stat-color-executives'
    },
    {
      label: 'Total Forms',
      value: totalForms,
      icon: '📋',
      colorClass: 'stat-color-total'
    },
    {
      label: 'Successful',
      value: successfulForms,
      icon: '✅',
      colorClass: 'stat-color-success'
    },
    {
      label: 'Not Interested',
      value: notInterestedForms,
      icon: '❌',
      colorClass: 'stat-color-not-interested'
    }
  ];

  return (
    <div className="summary-section card">
      <div className="summary-header">
        <h3 className="summary-title">Team Summary</h3>
        <DateFilter
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
          onClearFilters={onClearDateFilters}
        />
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.colorClass}-bg`}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <span className={`stat-value ${stat.colorClass}`}>
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSummary;