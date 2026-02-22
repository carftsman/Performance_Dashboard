import React from "react";

const DashboardHeader = ({ user, onAddExecutive, onAddEntry, onRefresh, loading, selectedExecutive  }) => {
  return (
    <>
      {/* CSS INSIDE COMPONENT */}
      <style>{`
        .dashboard-header {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);
          padding: 24px;
          margin-bottom: 24px;
          transition: 0.3s;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-title {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-subtitle {
          font-size: 16px;
          color: #666;
        }

        .highlight {
          font-weight: 600;
          color: #4a90e2;
          background: rgba(74,144,226,0.1);
          padding: 4px 8px;
          border-radius: 20px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: 0.3s;
          min-width: 120px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-success {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .btn-outline {
          background: white;
          border: 2px solid #ddd;
          color: #666;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      {/* YOUR UI CODE (NOT CHANGED) */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Team Lead Dashboard</h1>
            <p className="header-subtitle">
              Welcome back, <span className="highlight">{user?.userCode || "Team Lead"}</span>
            </p>
          </div>

          <div className="header-actions">
            <button onClick={onAddExecutive} className="btn btn-primary">
              <span>+</span> Add Executive
            </button>

            <button onClick={onAddEntry} className="btn btn-success">
              <span>+</span> Add Entry
            </button>
          
           {selectedExecutive && (
            <button
              onClick={onAddEntry}
              className="btn btn-success"
            >
              <span className="btn-icon">+</span>
              Add Entry for {selectedExecutive.name}
            </button>
          )}

            <button onClick={onRefresh} disabled={loading} className="btn btn-outline">
              <span className={loading ? "spin" : ""}>↻</span>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;