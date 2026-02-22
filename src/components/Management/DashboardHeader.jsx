const DashboardHeader = ({
  totalEntries,
  loading,
  onRefresh,
  onShowRequests,
  editRequestsCount = 0
}) => {
  return (
    <div className="card header-card">
      <div className="header-content">
        <div>
          <h1>Management Dashboard</h1>
          <p className="text-muted">
            Consolidated view of all field operations • {totalEntries} total entries
          </p>
        </div>

        <div className="header-actions">
          {/* Requests Button */}
          <button 
            className="btn btn-requests" 
            onClick={onShowRequests}
          >
            Requests
            {editRequestsCount > 0 && (
              <span className="badge-notification">
                {editRequestsCount}
              </span>
            )}
          </button>

          {/* Refresh Button */}
          <button 
            onClick={onRefresh} 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;