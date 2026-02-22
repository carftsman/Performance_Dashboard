const StatsCards = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">Total: {stats.total}</div>
      <div className="stat-card">Interested: {stats.interested}</div>
      <div className="stat-card">Not Interested: {stats.notInterested}</div>
    </div>
  );
};

export default StatsCards;