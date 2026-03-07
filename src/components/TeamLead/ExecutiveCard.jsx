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
      {/* Click hint */}
      <div className="view-link">
        View Details <span>→</span>
      </div>
    </div>
  );
};

export default ExecutiveCard;