import React from "react";

const DashboardHeader = ({
  dashboardUser,
  loading,
  onAddExecutive,
  onAddEntry,
  onRefresh,
}) => {
  return (
    <>
      {/* CSS INSIDE COMPONENT */}
      <style>{`
        .header-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border: 1px solid #eee;
          margin-bottom: 20px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .header-left h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color:black;
          
        }

        .text-muted {
          color: black;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 8px 14px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

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

      {/* HEADER UI */}
      <div className="card header-card">
        <div className="header-content">
          <div className="header-left">
            <div>
              <h1>Team Lead Dashboard - {dashboardUser?.userCode}
              </h1>
              
            </div>
          </div>

          <div className="header-actions">
            <button onClick={onAddExecutive} className="btn btn-primary">
              Add Executive
            </button>

            <button onClick={onAddEntry} className="btn btn-success">
              + Add Entry
            </button>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="btn btn-secondary"
            >
              {loading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;