import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import axios from 'axios';
import './ManagementDashboard.css';

const ManagementDashboard = ({ user, logout }) => {
  const dashboardUser = user || JSON.parse(localStorage.getItem('user'));

  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

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

  // Get unique team leads for filter
  const teamLeads = [...new Set(forms.map(form => form.teamleadName).filter(Boolean))];

  // Get unique executives for stats
  const executives = [...new Set(forms.map(form => form.executiveId))];

  // Calculate statistics
  const stats = {
    total: forms.length,
    interested: forms.filter(f => f.status === 'INTERESTED').length,
    onboarded: forms.filter(f => f.status === 'ONBOARDED').length,
    notInterested: forms.filter(f => f.status === 'NOT_INTERESTED').length,
    totalExecutives: executives.length,
    totalTeamLeads: teamLeads.length
  };

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

  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="management-dashboard">
        {/* Header */}
        <div className="card header-card">
          <div className="header-content">
            <div>
              <h1>Management Dashboard</h1>
              <p className="text-muted">
                Consolidated view of all field operations • {forms.length} total entries
              </p>
            </div>
            <button onClick={handleRefresh} className="btn btn-primary" disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
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
                <div className="stat-value">{stats.totalExecutives}</div>
                <div className="stat-label">Executives</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalTeamLeads}</div>
                <div className="stat-label">Team Leads</div>
              </div>
            </div>

            {/* Filters */}
            <div className="card filters-card">
              
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

                {(searchTerm || statusFilter !== 'all' || teamFilter !== 'all' || dateRange !== 'all') && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setTeamFilter('all');
                      setDateRange('all');
                    }}
                    className="btn btn-outline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="results-count">
                Showing {filteredForms.length} of {forms.length} entries
              </div>
            </div>

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
                            <td>
                              <div className="date-cell">{formatDate(form.createdAt)}</div>
                            </td>
                            <td>
                              <div className="shop-details">
                                <strong>{form.vendorShopName || 'N/A'}</strong>
                                {form.review && (
                                  <div className="review-text" title={form.review}>
                                    {form.review.length > 30 ? form.review.substring(0, 30) + '...' : form.review}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="vendor-info">
                                <strong>{form.vendorName || 'N/A'}</strong>
                                <div className="contact-info">
                                  <div>{form.contactNumber}</div>
                                  {form.mailId && <div className="email">{form.mailId}</div>}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="executive-info">
                                <strong>{form.executiveName || `ID: ${form.executiveId}`}</strong>
                              </div>
                            </td>
                            <td>
                              <div className="teamlead-info">
                                <strong>{form.teamleadName || `ID: ${form.teamleadId}`}</strong>
                              </div>
                            </td>
                            <td>
                              <div className="location-info">
                                <div>{form.areaName || 'N/A'}</div>
                                {form.state && <div className="state">{form.state}</div>}
                              </div>
                            </td>
                           
                            <td>{getTagBadge(form.tag)}</td>
                            <td>
                              <button 
                                onClick={() => toggleRowExpand(form.id)}
                                className="btn-icon"
                              >
                                {expandedRow === form.id ? '−' : '+'}
                              </button>
                            </td>
                          </tr>
                          {expandedRow === form.id && (
                            <tr className="expanded-row">
                              <td colSpan="9">
                                <div className="expanded-content">
                                  <div className="details-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Door Number:</span>
                                      <span>{form.doorNumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Street:</span>
                                      <span>{form.streetName || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">PIN Code:</span>
                                      <span>{form.pinCode || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Vendor Location:</span>
                                      <span>{form.vendorLocation || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Assigned BPO:</span>
                                      <span>{form.assignedBpoName || form.assignedBpoId || 'Not Assigned'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Executive Review:</span>
                                      <span>{form.executiveReview || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Vendor Review:</span>
                                      <span>{form.vendorReview || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">BPO Action Date:</span>
                                      <span>{form.bpoActionDate ? formatDate(form.bpoActionDate) : 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Reappear Date:</span>
                                      <span>{form.reappearDate ? formatDate(form.reappearDate) : 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Solved:</span>
                                      <span>{form.solved !== null ? (form.solved ? 'Yes' : 'No') : 'N/A'}</span>
                                    </div>
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

                {filteredForms.length === 0 && (
                  <div className="empty-state">
                    <p>No entries found matching your filters</p>
                  </div>
                )}
              </div>
            )}

            {/* Card View */}
            {/* {viewMode === 'card' && (
              <div className="card-grid">
                {filteredForms.map(form => (
                  <div key={form.id} className="data-card">
                    <div className="card-header">
                      <div className="card-title">
                        <h4>{form.vendorShopName || 'Unnamed Shop'}</h4>
                        <div className="card-badges">
                          {getStatusBadge(form.status)}
                          {getTagBadge(form.tag)}
                        </div>
                      </div>
                      <div className="card-subtitle">
                        {form.vendorName} • {formatDate(form.createdAt)}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="card-info-row">
                        <span className="info-label">Executive:</span>
                        <span className="info-value">{form.executiveName || `ID: ${form.executiveId}`}</span>
                      </div>
                      <div className="card-info-row">
                        <span className="info-label">Team Lead:</span>
                        <span className="info-value">{form.teamleadName || `ID: ${form.teamleadId}`}</span>
                      </div>
                      <div className="card-info-row">
                        <span className="info-label">Contact:</span>
                        <span className="info-value">{form.contactNumber}</span>
                      </div>
                      {form.mailId && (
                        <div className="card-info-row">
                          <span className="info-label">Email:</span>
                          <span className="info-value">{form.mailId}</span>
                        </div>
                      )}
                      <div className="card-info-row">
                        <span className="info-label">Location:</span>
                        <span className="info-value">{form.areaName}, {form.state}</span>
                      </div>
                      {form.review && (
                        <div className="card-review">
                          <span className="info-label">Review:</span>
                          <p>{form.review}</p>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => toggleRowExpand(form.id)}
                      className="btn-expand"
                    >
                      {expandedRow === form.id ? 'Show Less' : 'Show More'}
                    </button>

                    {expandedRow === form.id && (
                      <div className="card-expanded">
                        <div className="card-info-row">
                          <span className="info-label">Door Number:</span>
                          <span className="info-value">{form.doorNumber || 'N/A'}</span>
                        </div>
                        <div className="card-info-row">
                          <span className="info-label">Street:</span>
                          <span className="info-value">{form.streetName || 'N/A'}</span>
                        </div>
                        <div className="card-info-row">
                          <span className="info-label">PIN Code:</span>
                          <span className="info-value">{form.pinCode || 'N/A'}</span>
                        </div>
                        <div className="card-info-row">
                          <span className="info-label">Vendor Location:</span>
                          <span className="info-value">{form.vendorLocation || 'N/A'}</span>
                        </div>
                        <div className="card-info-row">
                          <span className="info-label">Assigned BPO:</span>
                          <span className="info-value">{form.assignedBpoName || form.assignedBpoId || 'Not Assigned'}</span>
                        </div>
                        {form.executiveReview && (
                          <div className="card-review">
                            <span className="info-label">Executive Review:</span>
                            <p>{form.executiveReview}</p>
                          </div>
                        )}
                        {form.vendorReview && (
                          <div className="card-review">
                            <span className="info-label">Vendor Review:</span>
                            <p>{form.vendorReview}</p>
                          </div>
                        )}
                        <div className="card-info-row">
                          <span className="info-label">BPO Action Date:</span>
                          <span className="info-value">{form.bpoActionDate ? formatDate(form.bpoActionDate) : 'N/A'}</span>
                        </div>
                        <div className="card-info-row">
                          <span className="info-label">Reappear Date:</span>
                          <span className="info-value">{form.reappearDate ? formatDate(form.reappearDate) : 'N/A'}</span>
                        </div>
                        <div className="card-info-row">
                          <span className="info-label">Solved:</span>
                          <span className="info-value">{form.solved !== null ? (form.solved ? 'Yes' : 'No') : 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {filteredForms.length === 0 && (
                  <div className="empty-state">
                    <p>No entries found matching your filters</p>
                  </div>
                )}
              </div>
            )} */}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ManagementDashboard;