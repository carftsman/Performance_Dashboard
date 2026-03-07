import ExecutiveCard from './ExecutiveCard';
import './ExecutiveList.css';

const ExecutiveList = ({ executives, onExecutiveClick, searchTerm, onClearSearch }) => {
  return (
    <div className="executive-list-section card">
      <div className="list-header">
        <h2 className="list-title">
          List of Executives <span className="badge">{executives.length}</span>
        </h2>
      </div>

      {executives.length > 0 && (
        <div className="executive-grid">
          {executives.map(executive => (
            <ExecutiveCard
              key={executive.id}
              executive={executive}
              onClick={() => onExecutiveClick(executive)}
            />
          ))}
        </div>
      )}

      {executives.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <p className="empty-text">
            {searchTerm ? 'No executives match your search.' : 'No executives found.'}
          </p>
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
  );
};

export default ExecutiveList;