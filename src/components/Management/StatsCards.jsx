const StatsCards = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">Total Entries</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{stats.totalExecutives}</div>
        <div className="stat-label">Executives</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{stats.totalTeamLeads}</div>
        <div className="stat-label">Team Leads</div>
      </div>
    </div>
  );
};

export default StatsCards;