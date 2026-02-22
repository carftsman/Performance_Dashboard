import React from 'react';
// import './ExecutiveCard.css';

const ExecutiveCard = ({ executive, onClick }) => {
  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'INTERESTED': return 'status-interested';
      case 'ONBOARDED': return 'status-onboarded';
      case 'NOT_INTERESTED': return 'status-not-interested';
      default: return 'status-pending';
    }
  };

  return (
    <>
    <style>
        {`
        /* Main Executive Card */
.executive-card {
  background: linear-gradient(135deg, #ffffff, #f8f9ff);
  border-radius: 18px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Hover Premium Effect */
.executive-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

/* Avatar */
.card-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* Content */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Name */
.executive-name {
  font-size: 17px;
  font-weight: 700;
  color: #222;
  margin: 0;
}

/* Stats Preview */
.stats-preview {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;
  font-weight: 500;
  color: #555;
}

/* Stat Item */
.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.04);
  padding: 3px 8px;
  border-radius: 10px;
}

/* Dots */
.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stat-dot.total {
  background: #667eea;
}

.stat-dot.interested {
  background: #28a745;
}

/* View Button */
.view-button {
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.view-button:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 18px rgba(102, 126, 234, 0.6);
}

/* ================= RESPONSIVE ================= */

/* Tablet */
@media (max-width: 1024px) {
  .executive-card {
    padding: 16px;
  }

  .card-avatar {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .executive-name {
    font-size: 16px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .executive-card {
    padding: 14px;
  }

  .card-avatar {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .stats-preview {
    font-size: 12px;
  }

  .view-button {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .executive-card {
    padding: 12px;
    border-radius: 14px;
  }

  .executive-name {
    font-size: 15px;
  }

  .stat-item {
    font-size: 11px;
  }
}

/* Ultra Wide Screens */
@media (min-width: 1600px) {
  .executive-card {
    padding: 22px;
  }

  .executive-name {
    font-size: 18px;
  }

  .card-avatar {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .executive-card {
    background: linear-gradient(135deg, #1e1e1e, #262626);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .executive-name {
    color: #eee;
  }

  .stats-preview {
    color: #aaa;
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.05);
  }
}
        `}
    </style>
    <div className="executive-card" onClick={onClick}>
      <div className="card-avatar">
        {getInitials(executive.name)}
      </div>
      
      <div className="card-content">
        <h3 className="executive-name">{executive.name}</h3>
      </div>
    </div>
    </>
  );
};

export default ExecutiveCard;