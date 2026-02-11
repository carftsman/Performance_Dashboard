import React, { useState } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import TeamOverview from '../components/TeamLead/TeamOverview';
import ExecutiveCard from '../components/TeamLead/ExecutiveCard';
import { teamData } from '../mockData/teamLeads';

const TeamLeadDashboard = ({ user, logout }) => {
  const dashboardUser = user || JSON.parse(localStorage.getItem('user')) || {
    name: "Anjali Mehta",
    email: "anjali@company.com",
    role: "teamlead"
  };

  const [viewMode, setViewMode] = useState('grid');
  const [selectedExecutive, setSelectedExecutive] = useState(null);

  const handleExecutiveClick = (executive) => {
    setSelectedExecutive(executive);
    alert(`Viewing detailed report for ${executive.name}`);
  };

  return (
    <MainLayout user={user}>
      <div className="teamlead-dashboard">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Team Lead Dashboard</h1>
              <p style={{ color: '#666', marginTop: '10px' }}>
                Managing {teamData.length} field executives
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={`btn ${viewMode === 'grid' ? 'btn-success' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button 
                className={`btn ${viewMode === 'table' ? 'btn-success' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Table View
              </button>
            </div>
          </div>
        </div>
        
        <TeamOverview />
        
        {viewMode === 'grid' ? (
          <div className="card">
            <h2 className="card-title">Executive Performance (Grid View)</h2>
            <div className="grid grid-3">
              {teamData.map(executive => (
                <ExecutiveCard 
                  key={executive.id} 
                  executive={executive}
                  onClick={() => handleExecutiveClick(executive)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="card">
            <h2 className="card-title">Executive Performance (Table View)</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Executive Name</th>
                    <th>Target</th>
                    <th>Achieved</th>
                    <th>Balance</th>
                    <th>Challenges/Questions</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.map(executive => (
                    <tr key={executive.id} className="clickable-row">
                      <td><strong>{executive.name}</strong></td>
                      <td>{executive.target}</td>
                      <td style={{ color: '#00b894', fontWeight: 'bold' }}>
                        {executive.achieved}
                      </td>
                      <td style={{ color: executive.balance > 0 ? '#e17055' : '#00b894' }}>
                        {executive.balance}
                      </td>
                      <td>
                        {executive.challenges.length > 0 ? (
                          <button 
                            className="btn"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                            onClick={() => alert(`Challenges: ${executive.challenges.join(', ')}`)}
                          >
                            View {executive.challenges.length} Challenges
                          </button>
                        ) : (
                          <span style={{ color: '#666' }}>No challenges</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-success"
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                          onClick={() => handleExecutiveClick(executive)}
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="card">
          <h3 className="card-title">Team Summary</h3>
          <div className="grid grid-3">
            <div className="stat-card">
              <div className="stat-value">6</div>
              <div className="stat-label">Total Executives</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#00b894' }}>92.8%</div>
              <div className="stat-label">Average Achievement</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#e17055' }}>9</div>
              <div className="stat-label">Total Challenges</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeamLeadDashboard;