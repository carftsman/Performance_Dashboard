import React from 'react';
import { currentExecutive } from '../../mockData/executives';

const ExecutiveStats = ({ period = 'daily' }) => {
  const getStats = () => {
    switch(period) {
      case 'weekly':
        return currentExecutive.weeklyStats;
      case 'monthly':
        return currentExecutive.monthlyStats;
      default:
        return currentExecutive.dailyLogs[0] || {};
    }
  };

  const stats = getStats();
  const achievementRate = ((stats.achieved / stats.target) * 100).toFixed(1);

  return (
    <div className="card">
      <h2 className="card-title">
        {period.charAt(0).toUpperCase() + period.slice(1)} Performance
      </h2>
      
      <div className="grid grid-4">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#667eea' }}>
            {stats.target || 0}
          </div>
          <div className="stat-label">Assigned Target</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#00b894' }}>
            {stats.achieved || 0}
          </div>
          <div className="stat-label">Achieved Orders</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: stats.balance > 0 ? '#e17055' : '#00b894' }}>
            {stats.balance || 0}
          </div>
          <div className="stat-label">Balance to Achieve</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#fdcb6e' }}>
            {stats.shopsVisited || 0}
          </div>
          <div className="stat-label">Shops Visited</div>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Location: {stats.location || 'Not specified'}</h3>
        
        {period === 'daily' && stats.challenges && (
          <div style={{
            backgroundColor: '#fff8e1',
            padding: '15px',
            borderRadius: '6px',
            marginTop: '15px'
          }}>
            <strong>Challenges: </strong>
            {stats.challenges}
          </div>
        )}
        
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {achievementRate}% Achievement Rate
          </div>
          <div style={{ marginTop: '10px' }}>
            {stats.balance > 0 ? `${stats.balance} more to achieve target` : 'Target exceeded!'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveStats;