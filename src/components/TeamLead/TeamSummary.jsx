
import DateFilter from './DateFilter';


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
      color: 'white'
    },
    {
      label: 'Total Forms',
      value: totalForms,
      icon: '📋',
      color: 'white'
    },
    {
      label: 'Successful',
      value: successfulForms,
      icon: '✅',
      color: 'white'
    },
    {
      label: 'Not Interested',
      value: notInterestedForms,
      icon: '❌',
      color: 'white'
    }
  ];

  return (
    <>
    <style>
        {`
            /* Main Summary Section */
.summary-section {
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: 0.3s ease;
}

.summary-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
}

/* Header */
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

/* Stat Card */
.stat-card {
  background: linear-gradient(135deg, #ffffff, #f8f9ff);
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Hover Effect */
.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

/* Icon */
.stat-icon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 4px 14px rgba(235, 205, 205, 0.12);
}

/* Content */
.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  color:black;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color:white;
}

/* Gradient Glow Effect */
.stat-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(102, 126, 234, 0.12), transparent 60%);
  opacity: 0;
  transition: 0.3s;
}

.stat-card:hover::before {
  opacity: 1;
}

/* ================= RESPONSIVE ================= */

/* Tablet */
@media (max-width: 1024px) {
  .summary-section {
    padding: 18px;
  }

  .summary-title {
    font-size: 18px;
  }

  .stat-card {
    padding: 14px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .summary-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 20px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .summary-section {
    padding: 12px;
    border-radius: 14px;
  }

  .summary-title {
    font-size: 16px;
  }

  .stat-card {
    padding: 12px;
    border-radius: 14px;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    font-size: 18px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-value {
    font-size: 18px;
  }
}

/* Ultra Wide Screens */
@media (min-width: 1600px) {
  .summary-section {
    padding: 28px;
  }

  .summary-title {
    font-size: 22px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 64px;
    height: 64px;
    font-size: 28px;
  }

  .stat-value {
    font-size: 26px;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .summary-section {
    background: rgba(20, 20, 20, 0.95);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .summary-title {
    background: linear-gradient(135deg, #a0b0ff, #c06bff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .stat-card {
    background: linear-gradient(135deg, #1e1e1e, #252525);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .stat-label {
    color: #aaa;
  }
}
        `}
    </style>
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
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default TeamSummary;