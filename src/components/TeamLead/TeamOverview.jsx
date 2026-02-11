import React from 'react';
import { teamOverview } from '../../mockData/teamLeads';

const TeamOverview = () => {
  return (
    <div className="card">
      <h2 className="card-title">Team Overview</h2>
      
      <div className="grid grid-4">
        <div className="stat-card">
          <div className="stat-value">{teamOverview.totalTarget}</div>
          <div className="stat-label">Total Target</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value stat-positive">{teamOverview.totalAchieved}</div>
          <div className="stat-label">Total Achieved</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value stat-negative">{teamOverview.totalBalance}</div>
          <div className="stat-label">Total Balance</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{teamOverview.averageAchievement}%</div>
          <div className="stat-label">Avg. Achievement</div>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <div className="grid grid-2">
          <div style={{
            backgroundColor: '#e8f5e9',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h3 style={{ color: '#00b894', marginBottom: '10px' }}>🏆 Top Performer</h3>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {teamOverview.topPerformer}
            </div>
            <div style={{ marginTop: '10px', color: '#666' }}>
              103% target achievement
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#ffebee',
            padding: '20px',
            borderRadius: '10px'
          }}>
            <h3 style={{ color: '#e17055', marginBottom: '10px' }}>📉 Needs Support</h3>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {teamOverview.lowPerformer}
            </div>
            <div style={{ marginTop: '10px', color: '#666' }}>
              83% target achievement
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;