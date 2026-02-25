import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart
} from 'recharts';
import './ReportDashboard.css';
import ReportModal from '../components/Management/ReportModal';

const ReportDashboard = ({ user, logout }) => {
  const dashboardUser = user || JSON.parse(localStorage.getItem('user'));
  const [showReportModal, setShowReportModal] = useState(false);
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [viewMode, setViewMode] = useState('charts');
  const [chartType, setChartType] = useState('overview'); // 'overview', 'teams', 'executives', 'trends'

  // Fetch all forms
  useEffect(() => {
    fetchAllForms();
  }, []);

  const fetchAllForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://mft-zwy7.onrender.com/api/data/forms",
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true 
        }
      );
      const formsData = Array.isArray(response.data) ? response.data : [];
      setForms(formsData);
      setFilteredForms(formsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setError("Failed to load data. Please try again.");
      setForms([]);
      setFilteredForms([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique team leads
  const teamLeads = [...new Set(forms.map(form => form.teamleadName).filter(Boolean))];
  
  // Get unique executives
  const executives = [...new Set(forms.map(form => ({
    id: form.executiveId,
    name: form.executiveName || `Executive ${form.executiveId}`,
    teamleadName: form.teamleadName
  })).filter(exec => exec.id))];

  // Remove duplicate executives
  const uniqueExecutives = Array.from(
    new Map(executives.map(exec => [exec.id, exec])).values()
  );

  // Calculate statistics
  const stats = {
    total: forms.length,
    interested: forms.filter(f => f.status === 'INTERESTED').length,
    notInterested: forms.filter(f => f.status === 'NOT_INTERESTED').length,
    totalExecutives: uniqueExecutives.length,
    totalTeamLeads: teamLeads.length
  };

  // Chart 1: Status Distribution (Pie Chart)
  const statusDistributionData = [
    { name: 'Interested', value: stats.interested, color: '#166534' },
    { name: 'Not Interested', value: stats.notInterested, color: '#991b1b' }
  ].filter(item => item.value > 0);

  // Chart 2: Tag Distribution
  const tagDistributionData = [
    { name: 'GREEN', value: forms.filter(f => f.tag === 'GREEN').length, color: '#166534' },
    { name: 'ORANGE', value: forms.filter(f => f.tag === 'ORANGE').length, color: '#9a3412' },
    { name: 'YELLOW', value: forms.filter(f => f.tag === 'YELLOW').length, color: '#854d0e' },
    { name: 'RED', value: forms.filter(f => f.tag === 'RED').length, color: '#991b1b' }
  ].filter(item => item.value > 0);

  // Chart 3: Team Lead Performance
  const teamLeadData = teamLeads.map(lead => {
    const leadForms = forms.filter(f => f.teamleadName === lead);
    return {
      name: lead,
      total: leadForms.length,
      interested: leadForms.filter(f => f.status === 'INTERESTED').length,
      notInterested: leadForms.filter(f => f.status === 'NOT_INTERESTED').length,
      
    };
  });

  // Chart 4: Executive Performance
  const executiveData = uniqueExecutives.map(exec => {
    const execForms = forms.filter(f => f.executiveId === exec.id);
    return {
      id: exec.id,
      name: exec.name,
      teamlead: exec.teamleadName || 'N/A',
      total: execForms.length,
      interested: execForms.filter(f => f.status === 'INTERESTED').length,
      notInterested: execForms.filter(f => f.status === 'NOT_INTERESTED').length,
     
    };
  }).sort((a, b) => b.total - a.total);

  // Chart 5: Daily/Monthly Trends
  const getTrendData = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Kolkata' });
      
      const dayForms = forms.filter(f => {
        const formDate = new Date(f.createdAt);
        return formDate.toDateString() === date.toDateString();
      });
      
      last30Days.push({
        date: dateStr,
        total: dayForms.length,
        interested: dayForms.filter(f => f.status === 'INTERESTED').length,
       
      });
    }
    
    return last30Days;
  };

  const trendData = getTrendData();

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      'INTERESTED': { background: '#dcfce7', color: '#166534', label: 'Interested' },
      'NOT_INTERESTED': { background: '#fee2e2', color: '#991b1b', label: 'Not Interested' }
    };
    const style = styles[status] || { background: '#f1f5f9', color: '#475569', label: status };
    
    return (
      <span className="badge" style={{ backgroundColor: style.background, color: style.color }}>
        {style.label}
      </span>
    );
  };

  // Get tag badge style
  const getTagBadge = (tag) => {
    const styles = {
      'GREEN': { background: '#dcfce7', color: '#166534' },
      'ORANGE': { background: '#ffedd5', color: '#9a3412' },
      'YELLOW': { background: '#fef9c3', color: '#854d0e' },
      'RED': { background: '#fee2e2', color: '#991b1b' }
    };
    const style = styles[tag] || { background: '#f1f5f9', color: '#475569' };
    
    return (
      <span className="badge tag-badge" style={{ backgroundColor: style.background, color: style.color }}>
        {tag || 'N/A'}
      </span>
    );
  };

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleRefresh = () => {
    fetchAllForms();
  };
  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="management-dashboard">
        {/* Header */}
        <div className="card header-card">
          <div className="header-content">
            <div>
              <h1>Reporter Dashboard</h1>
            </div>
            
            <div className="header-actions">
               <button 
        className="btn btn-success" 
        onClick={() => setShowReportModal(true)}
        disabled={loading}
      >
        📊 Generate Report
      </button>
              <button onClick={handleRefresh} className="btn btn-primary" disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card error-card">
            <p>{error}</p>
            <button onClick={handleRefresh} className="btn btn-outline">
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card loading-card">
            <div className="loader"></div>
            <p>Loading dashboard data...</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'black' }}>{stats.total}</div>
                <div className="stat-label" style={{ color: 'black' }}>Total Entries</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'black' }}>{stats.interested}</div>
                <div className="stat-label" style={{ color: 'black' }}>Interested</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'black' }}>{stats.notInterested}</div>
                <div className="stat-label" style={{ color: 'black' }}>Not Interested</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'black' }}>{stats.totalExecutives}</div>
                <div className="stat-label" style={{ color: 'black' }}>Executives</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'black' }}>{stats.totalTeamLeads}</div>
                <div className="stat-label" style={{ color: 'black' }}>Team Leads</div>
              </div>
            </div>


            {/* Chart Type Selector (only in charts mode) */}
            {viewMode === 'charts' && (
              <div className="card chart-type-card">
                <div className="chart-type-buttons">
                  <button 
                    className={`chart-type-btn ${chartType === 'overview' ? 'active' : ''}`}
                    onClick={() => setChartType('overview')}
                  >
                    Overview
                  </button>
                  <button 
                    className={`chart-type-btn ${chartType === 'teams' ? 'active' : ''}`}
                    onClick={() => setChartType('teams')}
                  >
                    Team Performance
                  </button>
                  <button 
                    className={`chart-type-btn ${chartType === 'executives' ? 'active' : ''}`}
                    onClick={() => setChartType('executives')}
                  >
                    Executive Performance
                  </button>
                  <button 
                    className={`chart-type-btn ${chartType === 'trends' ? 'active' : ''}`}
                    onClick={() => setChartType('trends')}
                  >
                    Trends
                  </button>
                </div>
              </div>
            )}

            {/* Charts View */}
            {viewMode === 'charts' && (
              <div className="charts-container">
                {chartType === 'overview' && (
                  <>
                    <div className="charts-grid">
                      {/* Status Distribution Pie Chart */}
                      <div className="chart-card">
                        <h3 className="chart-title">Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={statusDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {statusDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Tag Distribution Pie Chart */}
                      <div className="chart-card">
                        <h3 className="chart-title">Tag Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={tagDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {tagDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Team Lead Summary Chart */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">Team Lead Performance Summary</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={teamLeadData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="interested" fill="#166534" name="Interested" />
                          <Bar dataKey="notInterested" fill="#991b1b" name="Not Interested" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {chartType === 'teams' && (
                  <>
                    {/* Team Lead Comparison */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">Team Lead Performance Comparison</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={teamLeadData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={100} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="interested" fill="#166534" name="Interested" />
                          <Bar dataKey="notInterested" fill="#991b1b" name="Not Interested" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {chartType === 'executives' && (
                  <>
                    {/* Top Executives by Performance */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">Top 10 Executives by Total Entries</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={executiveData.slice(0, 10)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={120} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="total" fill="#3b82f6" name="Total Entries" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {chartType === 'trends' && (
                  <>
                    {/* Daily Trends */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">30-Day Activity Trend</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} interval={4} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="total" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Total Entries" />
                          <Area type="monotone" dataKey="interested" stackId="2" stroke="#166534" fill="#166534" fillOpacity={0.6} name="Interested" />
                         
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Cumulative Growth */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">Cumulative Growth</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} interval={4} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total Entries" strokeWidth={2} />
                          <Line type="monotone" dataKey="interested" stroke="#166534" name="Interested" strokeWidth={2} />
                         
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Composed Chart */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">Daily Performance Overview</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={trendData.slice(-15)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="total" fill="#3b82f6" name="Total Entries" />
                          <Line yAxisId="right" type="monotone" dataKey="interested" stroke="#166534" name="Interested" />

                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
         {/* Report Generation Modal */}
<ReportModal
  isOpen={showReportModal}
  onClose={() => setShowReportModal(false)}
  forms={forms}
/>
      </div>
    </MainLayout>
  );
};

export default ReportDashboard;