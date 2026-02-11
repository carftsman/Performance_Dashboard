import React, { useState } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import ConsolidatedView from '../components/Management/ConsolidatedView';

const ManagementDashboard = ({ user, logout }) => {
  const dashboardUser = user || JSON.parse(localStorage.getItem('user')) || {
    name: "Vikram Singh",
    email: "vikram@company.com",
    role: "management"
  };

  const [dateRange, setDateRange] = useState('monthly');
  const [selectedTeam, setSelectedTeam] = useState('all');
  return (
    <MainLayout user={user}>
      <div className="management-dashboard">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Management Dashboard</h1>
              <p style={{ color: '#666', marginTop: '10px' }}>
                Consolidated view of all field operations
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input-field"
                style={{ width: '120px' }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              
              <select 
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="input-field"
                style={{ width: '150px' }}
              >
                <option value="all">All Teams</option>
                <option value="north">Team North</option>
                <option value="south">Team South</option>
                <option value="east">Team East</option>
                <option value="west">Team West</option>
              </select>
              
              <button className="btn">
                📊 Generate Report
              </button>
            </div>
          </div>
        </div>
        
        <ConsolidatedView />
        
        <div className="grid grid-2">
          <div className="card">
            <h3 className="card-title">Performance Trend</h3>
            <div style={{
              height: '200px',
              background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              [Performance Chart Placeholder]
              <br />
              (Would show trends over time)
            </div>
          </div>
          
          <div className="card">
            <h3 className="card-title">Team-wise Comparison</h3>
            <div style={{
              height: '200px',
              background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}>
              [Comparison Chart Placeholder]
              <br />
              (Would show team comparisons)
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Quick Actions</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn">
              📥 Export Data
            </button>
            <button className="btn">
              📧 Send Report
            </button>
            <button className="btn">
              ⚙️ Settings
            </button>
            <button className="btn btn-success">
              📈 View Analytics
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManagementDashboard;