import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import axios from 'axios';
import { managerService } from '../Services/manager.service';
import ReportModal from '../components/Management/ReportModal';
import './ManagementDashboard.css';

const AdminDashboard = ({ user, logout }) => {
  const dashboardUser = user || JSON.parse(localStorage.getItem('user'));
// Report Generation State
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

  // ── Requests Feature State ────────────────────────────────────────────────
  const [editRequests, setEditRequests] = useState([]);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'ACCEPT'|'REJECT', request: obj }
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  // Fetch all forms & requests
  useEffect(() => {
    fetchAllForms();
    fetchRequests();
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

  const fetchRequests = async () => {
    try {
      const response = await managerService.getRequests();
      setEditRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching edit requests:", error);
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

  // ── Requests Flow Functions ───────────────────────────────────────────────
  const handleRequestAction = (type, request) => {
    setConfirmAction({ type, request });
  };

  const cancelRequestAction = () => {
    setConfirmAction(null);
  };

  const confirmRequestAction = async () => {
    if (!confirmAction) return;

    const { type, request } = confirmAction;
    setIsProcessingRequest(true);

    try {
      if (type === 'ACCEPT') {
        await managerService.approveRequest(request.id);
        alert("Request approved successfully.");
      } else if (type === 'REJECT') {
        await managerService.rejectRequest(request.id);
        alert("Request rejected successfully.");
      }

      // Close confirm and detail modal
      setConfirmAction(null);
      setSelectedRequest(null);
      // Refresh requests and forms
      fetchRequests();
      fetchAllForms();

      // Close list modal if no requests left
      if (editRequests.length <= 1) {
        setShowRequestsModal(false);
      }
    } catch (err) {
      console.error(`Failed to ${type.toLowerCase()} request:`, err);
      alert(`Failed to ${type.toLowerCase()} request. Please try again.`);
    } finally {
      setIsProcessingRequest(false);
    }
  };

  const handleRefresh = () => {
    fetchAllForms();
    fetchRequests();
  };

  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="management-dashboard">
        {/* Header */}
        <div className="card header-card">
          <div className="header-content">
            <div>
              <h1>Admin Dashboard</h1>
              {/* <p className="text-muted">
                Consolidated view of all field operations • {forms.length} total entries
              </p> */}
            </div>
             
            <div className="header-actions">
              <button 
                onClick={handleRefresh} 
                className="btn btn-primary" 
                disabled={loading}
              >
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

                  <button 
        className="btn btn-success" 
        onClick={() => setShowReportModal(true)}
        disabled={loading}
      >
        📊 Generate Report
      </button>
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

            {/* Unified Card View */}
            <div className="mgmt-grid">
              {filteredForms.map(form => (
                <div 
                  key={form.id} 
                  className="mgmt-card"
                  onClick={() => toggleRowExpand(form.id)}
                >
                  <div className="mgmt-card-header">
                    <h3 className="mgmt-shop-name">{form.vendorShopName || 'Unnamed Shop'}</h3>
                    <div className="mgmt-badges">
                      {getStatusBadge(form.status)}
                      {getTagBadge(form.tag)}
                    </div>
                  </div>
                  
                  <div className="mgmt-card-body">
                    <p className="mgmt-vendor-name">{form.vendorName || 'No Vendor Name'}</p>
                    <div className="mgmt-card-meta">
                      <span>👤 {form.executiveName || `ID: ${form.executiveId}`}</span>
                      <span>📍 {form.areaName || 'N/A'}, {form.state}</span>
                      <span>📅 {formatDate(form.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="mgmt-card-footer">
                    <span className="mgmt-view-btn">View Details &rarr;</span>
                  </div>
                </div>
              ))}

              {filteredForms.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>No Forms Found</h3>
                  <p>Try adjusting your search or filters to find what you're looking for.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── DETAIL MODAL (Manager View) ── */}
        {expandedRow && (
          <div className="mgmt-detail-modal-overlay" onClick={() => setExpandedRow(null)}>
            <div className="mgmt-detail-modal-content" onClick={e => e.stopPropagation()}>
              
              {/* Detail Header */}
              {forms.filter(f => f.id === expandedRow).map(form => (
                <React.Fragment key={`detail-${form.id}`}>
                  <div className="mgmt-detail-header">
                    <div>
                      <h2>{form.vendorShopName || 'Unnamed Shop'}</h2>
                      <p className="text-muted">ID: {form.id} • Submitted: {formatDate(form.createdAt)}</p>
                    </div>
                    <button className="mgr-close-btn" onClick={() => setExpandedRow(null)}>×</button>
                  </div>

                  {/* Detail Body */}
                  <div className="mgmt-detail-body">
                    
                    {/* Status & Tags Strip */}
                    <div className="mgmt-detail-strip">
                      <div className="strip-item">
                        <span className="strip-label">Status</span>
                        {getStatusBadge(form.status)}
                      </div>
                      <div className="strip-item">
                        <span className="strip-label">Priority Tag</span>
                        {getTagBadge(form.tag)}
                      </div>
                      <div className="strip-item">
                        <span className="strip-label">Solved</span>
                        <span className="info-value">{form.solved !== null ? (form.solved ? '✅ Yes' : '❌ No') : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="mgmt-detail-grid">
                      {/* Left Column: Vendor & Contact */}
                      <div className="mgmt-detail-section">
                        <h3>Vendor Information</h3>
                        <div className="detail-row">
                          <span className="detail-label">Owner Name</span>
                          <span className="detail-value">{form.vendorName || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Contact Number</span>
                          <span className="detail-value">{form.contactNumber || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Email Address</span>
                          <span className="detail-value">{form.mailId || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Right Column: Hierarchy */}
                      <div className="mgmt-detail-section">
                        <h3>Executive & Team</h3>
                        <div className="detail-row">
                          <span className="detail-label">Executive</span>
                          <span className="detail-value">{form.executiveName || `ID: ${form.executiveId}`}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Team Lead</span>
                          <span className="detail-value">{form.teamleadName || `ID: ${form.teamleadId}`}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Assigned BPO</span>
                          <span className="detail-value">{form.assignedBpoName || form.assignedBpoId || 'Not Assigned'}</span>
                        </div>
                      </div>

                      {/* Full Width: Location */}
                      <div className="mgmt-detail-section full-width">
                        <h3>Location Details</h3>
                        <div className="detail-row-inline">
                          <span className="detail-label">Door No:</span>
                          <span className="detail-value">{form.doorNumber || 'N/A'}</span>
                        </div>
                        <div className="detail-row-inline">
                          <span className="detail-label">Street:</span>
                          <span className="detail-value">{form.streetName || 'N/A'}</span>
                        </div>
                        <div className="detail-row-inline">
                          <span className="detail-label">Area/City:</span>
                          <span className="detail-value">{form.areaName || 'N/A'}</span>
                        </div>
                        <div className="detail-row-inline">
                          <span className="detail-label">State:</span>
                          <span className="detail-value">{form.state || 'N/A'}</span>
                        </div>
                        <div className="detail-row-inline">
                          <span className="detail-label">PIN:</span>
                          <span className="detail-value">{form.pinCode || 'N/A'}</span>
                        </div>
                        <div className="detail-row-inline location-link">
                          <span className="detail-label">GPS:</span>
                          <span className="detail-value">{form.vendorLocation || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Full Width: Reviews & Dates */}
                      <div className="mgmt-detail-section full-width">
                        <h3>Reviews & Actions</h3>
                        {form.review && (
                          <div className="review-box">
                            <strong>General Review:</strong>
                            <p>{form.review}</p>
                          </div>
                        )}
                        {form.executiveReview && (
                          <div className="review-box">
                            <strong>Executive Review:</strong>
                            <p>{form.executiveReview}</p>
                          </div>
                        )}
                        {form.vendorReview && (
                          <div className="review-box">
                            <strong>Vendor Review:</strong>
                            <p>{form.vendorReview}</p>
                          </div>
                        )}
                        
                        <div className="action-dates">
                          <div className="date-badge">
                            <span className="date-label">BPO Action Date:</span>
                            <span>{form.bpoActionDate ? formatDate(form.bpoActionDate) : 'Pending'}</span>
                          </div>
                          <div className="date-badge">
                            <span className="date-label">Reappear Date:</span>
                            <span>{form.reappearDate ? formatDate(form.reappearDate) : 'Not Set'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
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

export default AdminDashboard;