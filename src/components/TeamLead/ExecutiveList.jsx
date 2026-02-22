
import ExecutiveCard from './ExecutiveCard';


const ExecutiveList = ({ executives, onExecutiveClick, searchTerm, onClearSearch }) => {
  return (
    <>
    <style>
        {`
            /* Main Executive List Section */
.executive-list-section {
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: 0.3s ease;
}

.executive-list-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
}

/* Header */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.list-title {
  font-size: 22px;
  font-weight: 700;
  color: #222;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Badge Count */
.badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Executive Grid */
.executive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8f9ff, #eef2ff);
  border: 1px dashed #d0d7ff;
  margin-top: 20px;
  animation: fadeIn 0.4s ease;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  color: #667eea;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-bottom: 12px;
}

/* Reuse your global button styles */
.btn-outline {
  padding: 10px 18px;
  border-radius: 12px;
  border: 2px solid #667eea;
  background: transparent;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
  box-shadow: 0 6px 18px rgba(102, 126, 234, 0.4);
}

/* Fade Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ================= RESPONSIVE DESIGN ================= */

/* Tablet */
@media (max-width: 1024px) {
  .executive-list-section {
    padding: 18px;
  }

  .list-title {
    font-size: 20px;
  }

  .executive-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

/* Mobile */
@media (max-width: 768px) {
  .executive-list-section {
    padding: 16px;
  }

  .list-title {
    font-size: 18px;
  }

  .executive-grid {
    grid-template-columns: 1fr;
  }

  .empty-icon {
    font-size: 40px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .executive-list-section {
    padding: 12px;
    border-radius: 14px;
  }

  .list-title {
    font-size: 16px;
  }

  .badge {
    font-size: 12px;
    padding: 3px 10px;
  }
}

/* Ultra Wide Screens */
@media (min-width: 1600px) {
  .executive-list-section {
    padding: 28px;
  }

  .list-title {
    font-size: 24px;
  }

  .executive-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .executive-list-section {
    background: rgba(25, 25, 25, 0.95);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .list-title {
    color: #eee;
  }

  .empty-state {
    background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
    border-color: #444;
  }

  .empty-text {
    color: #aaa;
  }
}
        `}
    </style>
    <div className="executive-list-section card">
      <div className="list-header">
        <h2 className="list-title">
          List of Executives <span className="badge">{executives.length}</span>
        </h2>
      </div>
      
      <div className="executive-grid">
        {executives.map(executive => (
          <ExecutiveCard
            key={executive.id}
            executive={executive}
            onClick={() => onExecutiveClick(executive)}
          />
        ))}
      </div>

      {executives.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <p className="empty-text">No executives found</p>
          {searchTerm && (
            <button
              onClick={onClearSearch}
              className="btn btn-outline"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ExecutiveList;