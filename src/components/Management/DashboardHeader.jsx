const DashboardHeader = ({ total, loading, onRefresh, onReport }) => {
  return (
    <div className="card header-card">
      <div className="header-content">
        <div>
          <h1>Management Dashboard</h1>
          <p className="text-muted">Total entries: {total}</p>
        </div>

        <div className="header-actions">
          <button onClick={onReport} className="btn btn-success">
            Generate Report
          </button>

          <button onClick={onRefresh} className="btn btn-primary" disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;