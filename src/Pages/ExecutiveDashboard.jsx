import React, { useState } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import DailyEntryForm from '../components/Executive/DailyEntryForm';
import ExecutiveStats from '../components/Executive/ExecutiveStats';
import ViewToggle from '../components/Executive/ViewToggle';
import { currentExecutive } from '../mockData/executives';

const ExecutiveDashboard = ({ user, logout }) => {
  const [activeTab, setActiveTab] = useState('entry');
  const [period, setPeriod] = useState('daily');

  // If no user prop, try to get from localStorage
  const dashboardUser = user || JSON.parse(localStorage.getItem('user')) || currentExecutive;

  const handleSubmitDailyLog = (data) => {
    console.log('Submitted:', data);
    alert('Daily entry submitted successfully! (Mock)');
  };

  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="executive-dashboard">
        <div className="card">
          <h1>Welcome, {user.name}!</h1>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Track your daily field activities and monitor your performance
          </p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'entry' ? 'active' : ''}`}
              onClick={() => setActiveTab('entry')}
            >
              📝 Daily Entry
            </button>
            <button 
              className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              📊 Performance View
            </button>
          </div>
        </div>
        
        {activeTab === 'entry' ? (
          <DailyEntryForm onSubmit={handleSubmitDailyLog} />
        ) : (
          <>
            <ViewToggle period={period} onChange={setPeriod} />
            <ExecutiveStats period={period} />
            
            {period === 'daily' && (
              <div className="card">
                <h3 className="card-title">Recent Daily Entries</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Target</th>
                        <th>Achieved</th>
                        <th>Balance</th>
                        <th>Shops Visited</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentExecutive.dailyLogs.map((log, index) => (
                        <tr key={index}>
                          <td>{log.date}</td>
                          <td>{log.assignedTarget}</td>
                          <td style={{ color: '#00b894' }}>{log.achievedOrders}</td>
                          <td style={{ color: log.balanceToAchieve > 0 ? '#e17055' : '#00b894' }}>
                            {log.balanceToAchieve}
                          </td>
                          <td>{log.shopsVisited}</td>
                          <td>{log.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
        
        <div className="card">
          <h3 className="card-title">Quick Stats</h3>
          <div className="grid grid-3">
            <div className="stat-card">
              <div className="stat-value">1420</div>
              <div className="stat-label">Monthly Achievement</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">94.7%</div>
              <div className="stat-label">Achievement Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">750</div>
              <div className="stat-label">Total Shops Visited</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExecutiveDashboard;