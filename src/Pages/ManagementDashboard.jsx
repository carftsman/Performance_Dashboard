import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import axios from 'axios';
import { managerService } from '../Services/manager.service';
import DashboardHeader from '../components/Management/DashboardHeader';
import StatsCards from '../components/Management/StatsCards';
import './ManagementDashboard.css';
import FiltersBar from '../components/Management/FiltersBar';
import FormsGrid from '../components/Management/FormsGrid';
import FormDetailModal from '../components/Management/FormDetailModal';
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

  const clearFilters = () => {
  setSearchTerm("");
  setStatusFilter("all");
  setTeamFilter("all");
  setDateRange("all");
};

  const handleRefresh = () => {
    fetchAllForms();
    fetchRequests();
  };

  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="management-dashboard">
        {/* Header */}
        <DashboardHeader
  totalEntries={forms.length}
  loading={loading}
  onRefresh={handleRefresh}
  onShowRequests={() => setShowRequestsModal(true)}
  editRequestsCount={editRequests.length}
/>

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
          <StatsCards  stats={stats}/>

            {/* Filters */}
            <FiltersBar
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  teamFilter={teamFilter}
  setTeamFilter={setTeamFilter}
  dateRange={dateRange}
  setDateRange={setDateRange}
  statusFilter={statusFilter}
  setStatusFilter={setStatusFilter}
  teamLeads={teamLeads}
  clearFilters={clearFilters}
  filteredCount={filteredForms.length}
  totalCount={forms.length}
/>;
            {/* Unified Card View */}
           <FormsGrid
  filteredForms={filteredForms}
  toggleRowExpand={toggleRowExpand}
  getStatusBadge={getStatusBadge}
  getTagBadge={getTagBadge}
  formatDate={formatDate}
/>
          </>
        )}

       <FormDetailModal
  expandedRow={expandedRow}
  setExpandedRow={setExpandedRow}
  forms={forms}
  getStatusBadge={getStatusBadge}
  getTagBadge={getTagBadge}
  formatDate={formatDate}
/>
        {/* ── MODAL 1: REQUESTS LIST ── */}
        {showRequestsModal && (
          <div className="mgr-modal-overlay" onClick={() => setShowRequestsModal(false)}>
            <div className="mgr-list-modal" onClick={e => e.stopPropagation()}>
              <div className="mgr-modal-header">
                <h2>Pending Edit Requests ({editRequests.length})</h2>
                <button className="mgr-close-btn" onClick={() => setShowRequestsModal(false)}>×</button>
              </div>
              <div className="mgr-modal-body">
                {editRequests.length === 0 ? (
                  <div className="empty-state">
                    <p>No pending edit requests.</p>
                  </div>
                ) : (
                  <div className="mgr-requests-grid">
                    {editRequests.map(req => (
                      <div 
                        key={req.id} 
                        className="mgr-request-card"
                        onClick={() => setSelectedRequest(req)}
                      >
                        <div className="mgr-req-header">
                          <span className="mgr-req-title">{req.vendorShopName || 'Unnamed Shop'}</span>
                          <span className="mgr-req-date">{formatDate(req.createdAt)}</span>
                        </div>
                        <div className="mgr-req-subtitle">Requested by: {req.executiveName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 2: REQUEST DETAIL ── */}
        {selectedRequest && !confirmAction && (
          <div className="mgr-modal-overlay mgr-modal-overlay--detail" onClick={() => setSelectedRequest(null)}>
            <div className="mgr-detail-modal" onClick={e => e.stopPropagation()}>
              <div className="mgr-modal-header">
                <h2>Request Details</h2>
                <button className="mgr-close-btn" onClick={() => setSelectedRequest(null)}>×</button>
              </div>
              <div className="mgr-modal-body mgr-modal-body--scrollable">
                <div className="mgr-detail-group">
                  <label>Shop Name</label>
                  <p>{selectedRequest.vendorShopName || 'N/A'}</p>
                </div>
                <div className="mgr-detail-group">
                  <label>Executive Name</label>
                  <p>{selectedRequest.executiveName || 'N/A'}</p>
                </div>
                <div className="mgr-detail-group">
                  <label>Team Lead</label>
                  <p>{selectedRequest.teamleadName || 'N/A'}</p>
                </div>
                <div className="mgr-detail-group">
                  <label>Contact Number</label>
                  <p>{selectedRequest.contactNumber || 'N/A'}</p>
                </div>
                <div className="mgr-detail-group">
                  <label>Status Requirement</label>
                  <p>{selectedRequest.review || 'N/A'}</p>
                </div>
              </div>
              <div className="mgr-modal-footer">
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleRequestAction('REJECT', selectedRequest)}
                >
                  Reject
                </button>
                <button 
                  className="btn btn-success" 
                  onClick={() => handleRequestAction('ACCEPT', selectedRequest)}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 3: CONFIRM ACTION ── */}
        {confirmAction && (
          <div className="mgr-modal-overlay mgr-modal-overlay--prompt" onClick={cancelRequestAction}>
            <div className="mgr-prompt-modal" onClick={e => e.stopPropagation()}>
              <div className="mgr-prompt-header">
                <h4>Confirm {confirmAction.type === 'ACCEPT' ? 'Approval' : 'Rejection'}</h4>
                <button className="mgr-close-btn" onClick={cancelRequestAction} disabled={isProcessingRequest}>×</button>
              </div>
              <div className="mgr-prompt-body">
                <p>Are you sure you want to <strong>{confirmAction.type.toLowerCase()}</strong> this edit request?</p>
              </div>
              <div className="mgr-prompt-footer">
                <button 
                  className="btn btn-outline" 
                  onClick={cancelRequestAction}
                  disabled={isProcessingRequest}
                >
                  Cancel
                </button>
                <button 
                  className={`btn ${confirmAction.type === 'ACCEPT' ? 'btn-success' : 'btn-danger'}`}
                  onClick={confirmRequestAction}
                  disabled={isProcessingRequest}
                >
                  {isProcessingRequest ? 'Processing...' : 'Proceed'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default ManagementDashboard;