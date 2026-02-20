
import React, { useState } from 'react';
import LocationForm from '../Executive/LocationForm';
import './ExecutiveWorkView.css'; // We'll create this CSS file

const ExecutiveWorkView = ({ executive, onBack, onRefresh }) => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedForm, setSelectedForm] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

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
                <br/>
                {/* Team Lead: {executive.forms?.[0]?.teamleadName || 'N/A'} */}
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
          {/* Quick Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{executive.forms?.length || 0}</div>
              <div className="stat-label">Total Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#28a745' }}>
                {executive.forms?.filter(f => f.status === 'INTERESTED').length || 0}
              </div>
              <div className="stat-label">Interested</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#007bff' }}>
                {executive.forms?.filter(f => f.status === 'ONBOARDED').length || 0}
              </div>
              <div className="stat-label">Onboarded</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#dc3545' }}>
                {executive.forms?.filter(f => f.status === 'NOT_INTERESTED').length || 0}
              </div>
              <div className="stat-label">Not Interested</div>
            </div>
          </div>

          {/* Forms List - Desktop View */}
          <div className="card">
            <h3 className="card-title">All Entries</h3>
            
            {/* Desktop Table View */}
            <div className="table-container desktop-view">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Shop Name</th>
                    <th>Vendor Info</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Tag</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {executive.forms?.map(form => (
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
                            {form.mailId && <span>✉️{form.mailId}</span>}
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
                        <div className="shop-details">
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
                      {/* <td>
                        <button 
                          onClick={() => handleViewForm(form)}
                          className="btn btn-view"
                        >
                          View
                        </button>
                      </td> */}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-view">
              {executive.forms?.map(form => (
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
                      
                      {/* <div className="mobile-card-actions">
                        <button 
                          onClick={() => handleViewForm(form)}
                          className="btn btn-view btn-block"
                        >
                          View Full Details
                        </button>
                      </div> */}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {(!executive.forms || executive.forms.length === 0) && (
              <div className="empty-state">
                <p>No entries found for this executive</p>
                <button onClick={handleAddNew} className="btn btn-primary">
                  Add First Entry
                </button>
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