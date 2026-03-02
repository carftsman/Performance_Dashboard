import './ExecutiveCard.css';

const ExecutiveCard = ({ executive, onClick }) => {
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="executive-card" onClick={onClick}>
      {/* Left accent bar via ::before in CSS */}

      <div className="card-header">
        {/* Avatar */}
        <div className="avatar">
          {getInitials(executive.name)}
        </div>

        {/* Info */}
        <div className="info">
          <h3>{executive.name}</h3>
          <span className="role">Field Executive</span>
        </div>
      </div>

      {/* Stats */}
      <div className="card-stats">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{executive.stats?.total ?? 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Interested</span>
          <span className="stat-value interested">{executive.stats?.interested ?? 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Onboarded</span>
          <span className="stat-value onboarded">{executive.stats?.onboarded ?? 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Not Interested</span>
          <span className="stat-value not-interested">{executive.stats?.notInterested ?? 0}</span>
        </div>
      </div>

      {/* Click hint */}
      <div className="view-link">
        View Details <span>→</span>
      </div>
    </div>
  );
};

export default ExecutiveCard;