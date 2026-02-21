import React, { useState, useMemo } from 'react';
import LocationForm from '../Executive/LocationForm';
import './ExecutiveWorkView.css';

const ExecutiveWorkView = ({ executive, onBack, onRefresh }) => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedForm, setSelectedForm] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'day', 'week', 'month'
  const [customDate, setCustomDate] = useState('');

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Filter forms based on selected filter type
  const getFilteredForms = () => {
    if (!executive.forms) return [];
    
    if (filterType === 'all' || !customDate) {
      return executive.forms;
    }

    const filterDate = new Date(customDate);
    filterDate.setHours(0, 0, 0, 0);

    return executive.forms.filter(form => {
      const formDate = new Date(form.createdAt || form.date || new Date());
      formDate.setHours(0, 0, 0, 0);

      switch (filterType) {
        case 'day':
          // Show forms from the selected day
          return formDate.getTime() === filterDate.getTime();

        case 'week':
          // Show forms from the week containing the selected date
          const weekStart = new Date(filterDate);
          weekStart.setDate(filterDate.getDate() - filterDate.getDay()); // Start of week (Sunday)
          
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
          weekEnd.setHours(23, 59, 59, 999);
          
          return formDate >= weekStart && formDate <= weekEnd;

        case 'month':
          // Show forms from the month of selected date
          return formDate.getMonth() === filterDate.getMonth() && 
                 formDate.getFullYear() === filterDate.getFullYear();

        default:
          return true;
      }
    });
  };

  // Get stats for filtered forms
  const filteredForms = useMemo(() => getFilteredForms(), [executive.forms, filterType, customDate]);
  
  // Calculate stats based on filtered forms
  const stats = useMemo(() => ({
    total: filteredForms.length,
    interested: filteredForms.filter(f => f.status === 'INTERESTED').length,
    onboarded: filteredForms.filter(f => f.status === 'ONBOARDED').length,
    notInterested: filteredForms.filter(f => f.status === 'NOT_INTERESTED').length
  }), [filteredForms]);

  const handleFormSubmit = async (formData) => {
    console.log('Submitting form:', formData);
    setViewMode('list');
    onRefresh();
  };

  const handleViewForm = (form) => {
    setSelectedForm(form);
    setViewMode('form');
  };

  const handleAddNew = () => {
    setSelectedForm(null);
    setViewMode('form');
  };

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type === 'all') {
      setCustomDate('');
    } else if (!customDate) {
      setCustomDate(getTodayDate());
    }
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      'INTERESTED': { bg: '#d4edda', color: '#155724', label: 'Interested' },
      'ONBOARDED': { bg: '#cce5ff', color: '#004085', label: 'Onboarded' },
      'NOT_INTERESTED': { bg: '#f8d7da', color: '#721c24', label: 'Not Interested' },
      'FOLLOW_UP': { bg: '#fff3cd', color: '#856404', label: 'Follow Up' }
    };
    const style = styles[status] || { bg: '#e2e3e5', color: '#383d41', label: status };
    
    return (
      <span className="status-badge" style={{
        backgroundColor: style.bg,
        color: style.color
      }}>
        {style.label}
      </span>
    );
  };

  // Get tag badge style
  const getTagBadge = (tag) => {
    const styles = {
      'GREEN': { bg: '#d4edda', color: '#155724' },
      'ORANGE': { bg: '#fff3cd', color: '#856404' },
      'YELLOW': { bg: '#fff3cd', color: '#856404' },
      'RED': { bg: '#f8d7da', color: '#721c24' }
    };
    const style = styles[tag] || { bg: '#e2e3e5', color: '#383d41' };
    
    return (
      <span className="tag-badge" style={{
        backgroundColor: style.bg,
        color: style.color
      }}>
        {tag || 'N/A'}
      </span>
    );
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

  return (
    <div className="executive-work-view">
      {/* Header Section */}
      <div className="card header-card">
        <div className="header-content">
          <div className="header-left">
            <div className="executive-info">
              <h2>{executive.name}'s Work</h2>
              <p className="text-muted">
                Executive ID: {executive.id}
              </p>
            </div>
            <button onClick={onBack} className="btn btn-secondary">
              ← Back to List
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {viewMode === 'list' ? (
        <>
          {/* Filter Section */}
          <div className="card filter-card">
            <div className="filter-container">
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filterType === 'day' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('day')}
                >
                  Day
                </button>
                <button
                  className={`filter-btn ${filterType === 'week' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('week')}
                >
                  Week
                </button>
                <button
                  className={`filter-btn ${filterType === 'month' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('month')}
                >
                  Month
                </button>
              </div>
              
              {filterType !== 'all' && (
                <div className="date-picker-container">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="date-picker"
                    max={getTodayDate()}
                  />
                  {filteredForms.length > 0 && (
                    <span className="filter-results-count">
                      {filteredForms.length} entries found
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#28a745' }}>
                {stats.interested}
              </div>
              <div className="stat-label">Interested</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#007bff' }}>
                {stats.onboarded}
              </div>
              <div className="stat-label">Onboarded</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#dc3545' }}>
                {stats.notInterested}
              </div>
              <div className="stat-label">Not Interested</div>
            </div>
          </div>

          {/* Forms List - Desktop View */}
          <div className="card">
            <h3 className="card-title">
              All Entries
              {filterType !== 'all' && customDate && (
                <span className="filter-subtitle">
                  {filterType === 'day' && ` - ${new Date(customDate).toLocaleDateString('en-IN')}`}
                  {filterType === 'week' && ` - Week of ${new Date(customDate).toLocaleDateString('en-IN')}`}
                  {filterType === 'month' && ` - ${new Date(customDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`}
                </span>
              )}
            </h3>
            
            {/* Desktop Table View */}
            <div className="table-container desktop-view">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Shop Name</th>
                    <th>Vendor Info</th>
                    <th>Location</th>
                    <th>Review</th>
                    <th>Status</th>
                    <th>Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForms.map(form => (
                    <tr key={form.id}>
                      <td>
                        <div className="date-cell">
                          {formatDate(form.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="shop-details">
                          <strong>{form.vendorShopName}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="vendor-info">
                          <div><strong>{form.vendorName}</strong></div>
                          <div className="contact-info">
                            <span>📞 {form.contactNumber}</span>
                            {form.mailId && <span>✉️ {form.mailId}</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="location-info">
                          <div>{form.areaName}, {form.state}</div>
                          {form.pinCode && <div>PIN: {form.pinCode}</div>}
                        </div>
                      </td>
                      <td>
                        <div className="review-cell">
                          {form.review && (
                            <div className="review-text" title={form.review}>
                              {form.review.substring(0, 30)}
                              {form.review.length > 30 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{getStatusBadge(form.status)}</td>
                      <td>{getTagBadge(form.tag)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-view">
              {filteredForms.map(form => (
                <div key={form.id} className="mobile-card">
                  <div className="mobile-card-header" onClick={() => toggleRowExpand(form.id)}>
                    <div className="mobile-card-title">
                      <h4>{form.vendorShopName}</h4>
                      <span className="expand-icon">
                        {expandedRow === form.id ? '▼' : '▶'}
                      </span>
                    </div>
                    <div className="mobile-card-subtitle">
                      {form.vendorName} • {formatDate(form.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mobile-card-badges">
                    {getStatusBadge(form.status)}
                    {getTagBadge(form.tag)}
                  </div>

                  {expandedRow === form.id && (
                    <div className="mobile-card-details">
                      <div className="detail-row">
                        <span className="detail-label">Contact:</span>
                        <span className="detail-value">{form.contactNumber}</span>
                      </div>
                      {form.mailId && (
                        <div className="detail-row">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">{form.mailId}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{form.areaName}, {form.state}</span>
                      </div>
                      {form.pinCode && (
                        <div className="detail-row">
                          <span className="detail-label">PIN:</span>
                          <span className="detail-value">{form.pinCode}</span>
                        </div>
                      )}
                      {form.review && (
                        <div className="detail-row">
                          <span className="detail-label">Review:</span>
                          <span className="detail-value">{form.review}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Team Lead:</span>
                        <span className="detail-value">{form.teamleadName}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredForms.length === 0 && (
              <div className="empty-state">
                <p>
                  {filterType !== 'all' && customDate 
                    ? `No entries found for the selected ${filterType}`
                    : 'No entries found for this executive'}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card">
          <div className="form-header">
            <h3>{selectedForm ? 'View Entry' : 'Add New Entry'}</h3>
          </div>
          
          <LocationForm
            onSubmit={handleFormSubmit}
            locationEnabled={true}
            isSubmitting={false}
            userCode={executive.name}
            initialData={selectedForm}
            readOnly={!!selectedForm}
          />
          <button onClick={() => setViewMode('list')} className="btn btn-secondary">
            Back to List
          </button>
        </div>
      )}
    </div>
  );
};

export default ExecutiveWorkView;