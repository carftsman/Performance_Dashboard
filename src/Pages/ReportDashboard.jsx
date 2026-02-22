import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ComposedChart, Scatter,ScatterChart
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [viewMode, setViewMode] = useState('charts'); // 'charts', 'table', or 'cards'
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

      console.log("All Forms:", response.data);
      
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

  // Apply filters
  useEffect(() => {
    let filtered = [...forms];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(form => 
        form.vendorShopName?.toLowerCase().includes(term) ||
        form.vendorName?.toLowerCase().includes(term) ||
        form.executiveName?.toLowerCase().includes(term) ||
        form.teamleadName?.toLowerCase().includes(term) ||
        form.areaName?.toLowerCase().includes(term) ||
        form.contactNumber?.includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(form => form.status === statusFilter);
    }

    // Apply team filter (by teamlead)
    if (teamFilter !== 'all') {
      filtered = filtered.filter(form => form.teamleadName === teamFilter);
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));

      filtered = filtered.filter(form => {
        const formDate = new Date(form.createdAt);
        if (dateRange === 'today') {
          return formDate >= today;
        } else if (dateRange === 'week') {
          return formDate >= weekAgo;
        } else if (dateRange === 'month') {
          return formDate >= monthAgo;
        }
        return true;
      });
    }

    setFilteredForms(filtered);
  }, [searchTerm, statusFilter, teamFilter, dateRange, forms]);

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
    onboarded: forms.filter(f => f.status === 'ONBOARDED').length,
    notInterested: forms.filter(f => f.status === 'NOT_INTERESTED').length,
    totalExecutives: uniqueExecutives.length,
    totalTeamLeads: teamLeads.length
  };

  // Chart 1: Status Distribution (Pie Chart)
  const statusDistributionData = [
    { name: 'Interested', value: stats.interested, color: '#166534' },
    { name: 'Onboarded', value: stats.onboarded, color: '#1e40af' },
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
      onboarded: leadForms.filter(f => f.status === 'ONBOARDED').length,
      notInterested: leadForms.filter(f => f.status === 'NOT_INTERESTED').length,
      conversionRate: leadForms.length > 0 
        ? ((leadForms.filter(f => f.status === 'ONBOARDED').length / leadForms.length) * 100).toFixed(1)
        : 0
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
      onboarded: execForms.filter(f => f.status === 'ONBOARDED').length,
      notInterested: execForms.filter(f => f.status === 'NOT_INTERESTED').length,
      conversionRate: execForms.length > 0 
        ? ((execForms.filter(f => f.status === 'ONBOARDED').length / execForms.length) * 100).toFixed(1)
        : 0
    };
  }).sort((a, b) => b.total - a.total);

  // Chart 5: Daily/Monthly Trends
  const getTrendData = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' });
      
      const dayForms = forms.filter(f => {
        const formDate = new Date(f.createdAt);
        return formDate.toDateString() === date.toDateString();
      });
      
      last30Days.push({
        date: dateStr,
        total: dayForms.length,
        interested: dayForms.filter(f => f.status === 'INTERESTED').length,
        onboarded: dayForms.filter(f => f.status === 'ONBOARDED').length
      });
    }
    
    return last30Days;
  };

  const trendData = getTrendData();

  // Chart 6: Team Comparison Radar
  const teamComparisonData = teamLeads.map(lead => {
    const leadForms = forms.filter(f => f.teamleadName === lead);
    return {
      team: lead,
      interested: leadForms.filter(f => f.status === 'INTERESTED').length,
      onboarded: leadForms.filter(f => f.status === 'ONBOARDED').length,
      notInterested: leadForms.filter(f => f.status === 'NOT_INTERESTED').length,
      greenTag: leadForms.filter(f => f.tag === 'GREEN').length,
      orangeTag: leadForms.filter(f => f.tag === 'ORANGE').length
    };
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      'INTERESTED': { background: '#dcfce7', color: '#166534', label: 'Interested' },
      'ONBOARDED': { background: '#dbeafe', color: '#1e40af', label: 'Onboarded' },
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

  const COLORS = ['#166534', '#1e40af', '#991b1b', '#9a3412', '#854d0e', '#3b82f6'];

  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="management-dashboard">
        {/* Header */}
        <div className="card header-card">
          <div className="header-content">
            <div>
              <h1>Reporter Dashboard</h1>
              <p className="text-muted">
                Consolidated view of all field operations • {forms.length} total entries
              </p>
            </div>
            <div className="header-actions">
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
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Entries</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#166534' }}>{stats.interested}</div>
                <div className="stat-label">Interested</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#1e40af' }}>{stats.onboarded}</div>
                <div className="stat-label">Onboarded</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#991b1b' }}>{stats.notInterested}</div>
                <div className="stat-label">Not Interested</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalExecutives}</div>
                <div className="stat-label">Executives</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalTeamLeads}</div>
                <div className="stat-label">Team Leads</div>
              </div>
            </div>

            {/* View Toggle and Filters */}
            <div className="card filters-card">
              <div className="filters-header">
                <div className="view-toggle-group">
                  <button 
                    className={`view-toggle-btn ${viewMode === 'charts' ? 'active' : ''}`}
                    onClick={() => setViewMode('charts')}
                  >
                    📊 Charts
                  </button>
                  <button 
                    className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    📋 Table
                  </button>
                  <button 
                    className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                    onClick={() => setViewMode('cards')}
                  >
                    🃏 Cards
                  </button>
                   <button 
        className="btn btn-success" 
        onClick={() => setShowReportModal(true)}
        disabled={loading}
      >
        📊 Generate Report
      </button>
                </div>
                
                {(searchTerm || statusFilter !== 'all' || teamFilter !== 'all' || dateRange !== 'all') && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setTeamFilter('all');
                      setDateRange('all');
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              <div className="filters-grid">
                <input
                  type="text"
                  placeholder="Search by shop, vendor, executive..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />

                <select 
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Team Leads</option>
                  {teamLeads.map(lead => (
                    <option key={lead} value={lead}>{lead}</option>
                  ))}
                </select>

                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              <div className="results-count">
                Showing {filteredForms.length} of {forms.length} entries
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
                          <Bar dataKey="onboarded" fill="#1e40af" name="Onboarded" />
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
                          <Bar dataKey="onboarded" fill="#1e40af" name="Onboarded" />
                          <Bar dataKey="notInterested" fill="#991b1b" name="Not Interested" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Team Lead Conversion Rates */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">Team Lead Conversion Rates (%)</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={teamLeadData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="conversionRate" fill="#3b82f6" name="Conversion Rate %">
                            {teamLeadData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.conversionRate > 50 ? '#166534' : '#9a3412'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Team Lead Radar Chart */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">Team Lead Performance Radar</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamComparisonData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="team" />
                          <PolarRadiusAxis />
                          <Radar name="Interested" dataKey="interested" stroke="#166534" fill="#166534" fillOpacity={0.6} />
                          <Radar name="Onboarded" dataKey="onboarded" stroke="#1e40af" fill="#1e40af" fillOpacity={0.6} />
                          <Radar name="Green Tag" dataKey="greenTag" stroke="#166534" fill="#166534" fillOpacity={0.3} />
                          <Legend />
                          <Tooltip />
                        </RadarChart>
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
                          <Bar dataKey="onboarded" fill="#1e40af" name="Onboarded" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Executive Conversion Rates */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">Executive Conversion Rates (%)</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={executiveData.filter(e => e.total > 0).slice(0, 15)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="conversionRate" fill="#166534" name="Conversion Rate %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Executive Scatter Plot */}
                    <div className="chart-card full-width">
                      <h3 className="chart-title">Executive Performance: Total vs Onboarded</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid />
                          <XAxis type="number" dataKey="total" name="Total Entries" />
                          <YAxis type="number" dataKey="onboarded" name="Onboarded" />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          <Scatter name="Executives" data={executiveData} fill="#3b82f6">
                            {executiveData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.conversionRate > 50 ? '#166534' : '#9a3412'} />
                            ))}
                          </Scatter>
                        </ScatterChart>
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
                          <Area type="monotone" dataKey="onboarded" stackId="3" stroke="#1e40af" fill="#1e40af" fillOpacity={0.6} name="Onboarded" />
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
                          <Line type="monotone" dataKey="onboarded" stroke="#1e40af" name="Onboarded" strokeWidth={2} />
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
                          <Line yAxisId="right" type="monotone" dataKey="onboarded" stroke="#1e40af" name="Onboarded" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="card">
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Shop Details</th>
                        <th>Vendor Info</th>
                        <th>Executive</th>
                        <th>Team Lead</th>
                        <th>Location</th>
                        <th>Tag</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredForms.map(form => (
                        <React.Fragment key={form.id}>
                          <tr>
                            <td><div className="date-cell">{formatDate(form.createdAt)}</div></td>
                            <td>
                              <div className="shop-details">
                                <strong>{form.vendorShopName || 'N/A'}</strong>
                                {form.review && <div className="review-text">{form.review.substring(0, 30)}...</div>}
                              </div>
                            </td>
                            <td>
                              <div className="vendor-info">
                                <strong>{form.vendorName || 'N/A'}</strong>
                                <div className="contact-info">{form.contactNumber}</div>
                              </div>
                            </td>
                            <td><strong>{form.executiveName || `ID: ${form.executiveId}`}</strong></td>
                            <td><strong>{form.teamleadName || `ID: ${form.teamleadId}`}</strong></td>
                            <td>
                              <div className="location-info">
                                <div>{form.areaName || 'N/A'}</div>
                                {form.state && <div className="state">{form.state}</div>}
                              </div>
                            </td>
                            <td>{getTagBadge(form.tag)}</td>
                            <td>
                              <button onClick={() => toggleRowExpand(form.id)} className="btn-icon">
                                {expandedRow === form.id ? '−' : '+'}
                              </button>
                            </td>
                          </tr>
                          {expandedRow === form.id && (
                            <tr className="expanded-row">
                              <td colSpan="8">
                                <div className="expanded-content">
                                  <div className="details-grid">
                                    <div className="detail-item"><span className="detail-label">Door Number:</span><span>{form.doorNumber || 'N/A'}</span></div>
                                    <div className="detail-item"><span className="detail-label">Street:</span><span>{form.streetName || 'N/A'}</span></div>
                                    <div className="detail-item"><span className="detail-label">PIN Code:</span><span>{form.pinCode || 'N/A'}</span></div>
                                    <div className="detail-item"><span className="detail-label">Status:</span><span>{getStatusBadge(form.status)}</span></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredForms.length === 0 && <div className="empty-state"><p>No entries found</p></div>}
              </div>
            )}

            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="card-grid">
                {filteredForms.map(form => (
                  <div key={form.id} className="data-card">
                    <div className="card-header">
                      <div className="card-title">
                        <h4>{form.vendorShopName || 'Unnamed Shop'}</h4>
                        <div className="card-badges">{getTagBadge(form.tag)}</div>
                      </div>
                      <div className="card-subtitle">{form.vendorName} • {formatDate(form.createdAt)}</div>
                    </div>
                    <div className="card-body">
                      <div className="card-info-row"><span className="info-label">Executive:</span><span>{form.executiveName || `ID: ${form.executiveId}`}</span></div>
                      <div className="card-info-row"><span className="info-label">Team Lead:</span><span>{form.teamleadName || `ID: ${form.teamleadId}`}</span></div>
                      <div className="card-info-row"><span className="info-label">Contact:</span><span>{form.contactNumber}</span></div>
                      <div className="card-info-row"><span className="info-label">Location:</span><span>{form.areaName}, {form.state}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
         {/* Report Generation Modal */}
<ReportModal
  isOpen={showReportModal}
  onClose={() => setShowReportModal(false)}
  forms={forms}
  onGenerate={() => {
    // Optional: Show success message or refresh data
    console.log('Report generated successfully');
  }}
/>
      </div>
    </MainLayout>
  );
};

export default ReportDashboard;