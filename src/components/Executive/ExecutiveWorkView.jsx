import React, { useState, useMemo } from 'react';
import LocationForm from '../Executive/VendorForm';
import HeaderSection from '../Executive/HeaderSection';
import FilterSection from '../Executive/FilterSection';
import FormsTable from '../Executive/FormsTable';
import './ExecutiveWorkView.css';

const ExecutiveWorkView = ({ executive, onBack, onRefresh }) => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedForm, setSelectedForm] = useState(null);
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
    notInterested: filteredForms.filter(f => f.status === 'NOT_INTERESTED').length
  }), [filteredForms]);

  const handleFormSubmit = async (formData) => {
    console.log('Submitting form:', formData);
    setViewMode('list');
    onRefresh();
  };

  const handleAddNew = () => {
    setSelectedForm(null);
    setViewMode('form');
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
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  return (
    <div className="executive-work-view">
      {/* Header Section */}
      <HeaderSection executive={executive} onBack={onBack} />

      {/* Content Section */}
      {viewMode === 'list' ? (
        <>
          {/* Filter Section */}
          <FilterSection
  filterType={filterType}
  onFilterChange={handleFilterChange}
  customDate={customDate}
  onDateChange={setCustomDate}
  getTodayDate={getTodayDate}
  filteredCount={filteredForms.length}
/>

          {/* Quick Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value" style={{color:'black'}}>{stats.total}</div>
              <div className="stat-label" style={{color:'black'}}>Total Entries</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'black' }}>
                {stats.interested}
              </div>
              <div className="stat-label" style={{color:'black'}}>Interested</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'black' }}>
                {stats.notInterested}
              </div>
              <div className="stat-label" style={{color:'black'}}>Not Interested</div>
            </div>
          </div>

          {/* Forms List - Desktop View */}
          <div className="card">
            <h3 className="card-title">
              All Entries
              {filterType !== 'all' && customDate && (
                <span className="filter-subtitle">
                  {filterType === 'day' && ` - ${new Date(customDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`}
                  {filterType === 'week' && ` - Week of ${new Date(customDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`}
                  {filterType === 'month' && ` - ${new Date(customDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}`}
                </span>
              )}
            </h3>
            
            {/* Desktop Table View */}
            <FormsTable forms={filteredForms} />
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