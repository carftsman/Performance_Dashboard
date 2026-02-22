import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import ExecutiveWorkView from '../components/TeamLead/ExecutiveWorkView';
import VendorForm from '../components/Executive/VendorForm';
import { teamLeadService } from '../Services/teamlead.service';
import './TeamLeadDashboard.css'; // We'll create this CSS file

const TeamLeadDashboard = ({ user, logout }) => {
  const dashboardUser = user || JSON.parse(localStorage.getItem('user'));
  
  const [viewMode, setViewMode] = useState('list'); // 'list', 'work', or 'add-entry'
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [executiveForms, setExecutiveForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [selectedExecutiveForForm, setSelectedExecutiveForForm] = useState(null);
  
  // New state for add executive modal
  const [showAddExecutiveModal, setShowAddExecutiveModal] = useState(false);
  const [newExecutive, setNewExecutive] = useState({
    executiveCode: '',
    name: '',
    phone: ''
  });
  const [isAddingExecutive, setIsAddingExecutive] = useState(false);
  const [executiveAddSuccess, setExecutiveAddSuccess] = useState(null);
  
  // New state for date filters
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [filteredForms, setFilteredForms] = useState([]);

  // Fetch all forms for the team lead
  useEffect(() => {
    fetchTeamLeadForms();
  }, []);

  // Update filtered forms when executiveForms or dateFilter changes
  useEffect(() => {
    filterFormsByDate();
  }, [executiveForms, dateFilter]);

  const fetchTeamLeadForms = async () => {
    try {
      setLoading(true);
      console.log('Calling API');
      
      const data = await teamLeadService.getForms();

      console.log("Team Lead Forms:", data);
      
      const formsData = Array.isArray(data) ? data : [];
      setExecutiveForms(formsData);
      setFilteredForms(formsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching team lead forms:", error);
      setError("Failed to load team data. Please try again.");
      setExecutiveForms([]);
      setFilteredForms([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter forms by date
  const filterFormsByDate = () => {
    if (!dateFilter.startDate && !dateFilter.endDate) {
      setFilteredForms(executiveForms);
      return;
    }

    const filtered = executiveForms.filter(form => {
      // Assuming form has a createdAt or date field
      const formDate = new Date(form.createdAt || form.date || new Date());
      
      if (dateFilter.startDate && dateFilter.endDate) {
        const start = new Date(dateFilter.startDate);
        const end = new Date(dateFilter.endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date
        return formDate >= start && formDate <= end;
      } else if (dateFilter.startDate) {
        const start = new Date(dateFilter.startDate);
        return formDate >= start;
      } else if (dateFilter.endDate) {
        const end = new Date(dateFilter.endDate);
        end.setHours(23, 59, 59, 999);
        return formDate <= end;
      }
      
      return true;
    });

    setFilteredForms(filtered);
  };

  // Handle date filter change
  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear date filters
  const clearDateFilters = () => {
    setDateFilter({
      startDate: '',
      endDate: ''
    });
  };

  // Handle add executive form input change
  const handleExecutiveInputChange = (e) => {
    const { name, value } = e.target;
    setNewExecutive(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle add executive submit
  const handleAddExecutive = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newExecutive.executiveCode || !newExecutive.name || !newExecutive.phone) {
      setExecutiveAddSuccess({ 
        type: 'error', 
        message: 'Please fill in all fields' 
      });
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(newExecutive.phone)) {
      setExecutiveAddSuccess({ 
        type: 'error', 
        message: 'Please enter a valid 10-digit phone number' 
      });
      return;
    }

    try {
      setIsAddingExecutive(true);
      setExecutiveAddSuccess(null);

      // API call to create executive
      const response = await teamLeadService.createExecutive(newExecutive);

      console.log('Executive created:', response);

      setExecutiveAddSuccess({ 
        type: 'success', 
        message: response.message || 'Executive created successfully!' 
      });

      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setShowAddExecutiveModal(false);
        setNewExecutive({
          executiveCode: '',
          name: '',
          phone: ''
        });
        setExecutiveAddSuccess(null);
        
        // Refresh the team data to show the new executive
        fetchTeamLeadForms();
      }, 2000);

    } catch (error) {
      console.error("Error creating executive:", error);
      setExecutiveAddSuccess({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to create executive. Please try again.' 
      });
    } finally {
      setIsAddingExecutive(false);
    }
  };

  // Handle form submission for new entry
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitSuccess(null);

      // Add team lead information to form data
      const submissionData = {
        ...formData,
        teamleadId: dashboardUser?.id || 19, // Fallback to 19 if not available
        teamleadName: dashboardUser?.userCode || 'Naveen',
        executiveId: selectedExecutiveForForm?.id,
        executiveName: selectedExecutiveForForm?.name
      };

      console.log('Submitting form:', submissionData);

      // API call would go here
      // const response = await axios.post(
      //   "https://mft-zwy7.onrender.com/api/teamlead/add-entry",
      //   submissionData,
      //   {
      //     headers: { 'Content-Type': 'application/json' },
      //     withCredentials: true
      //   }
      // );

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitSuccess({ type: 'success', message: 'Entry added successfully!' });
      
      // Refresh data after successful submission
      await fetchTeamLeadForms();
      
      // Go back to list view after 2 seconds
      setTimeout(() => {
        setViewMode('list');
        setSelectedExecutiveForForm(null);
        setSubmitSuccess(null);
      }, 2000);

    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitSuccess({ 
        type: 'error', 
        message: 'Failed to add entry. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group forms by executive (using filteredForms instead of executiveForms)
  const getExecutivesWithForms = () => {
    const execMap = new Map();
    
    filteredForms.forEach(form => {
      const execId = form.executiveId;
      if (!execMap.has(execId)) {
        execMap.set(execId, {
          id: execId,
          name: form.executiveName || `Executive ${execId}`,
          teamleadName: form.teamleadName,
          forms: [],
          stats: {
            total: 0,
            interested: 0,
            onboarded: 0,
            notInterested: 0
          }
        });
      }
      
      const exec = execMap.get(execId);
      exec.forms.push(form);
      exec.stats.total++;
      
      // Update stats based on status
      if (form.status === 'INTERESTED') exec.stats.interested++;
      else if (form.status === 'ONBOARDED') exec.stats.onboarded++;
      else if (form.status === 'NOT_INTERESTED') exec.stats.notInterested++;
    });

    return Array.from(execMap.values());
  };

  // Filter executives based on search
  const getFilteredExecutives = () => {
    const executives = getExecutivesWithForms();
    if (!searchTerm.trim()) return executives;
    
    const term = searchTerm.toLowerCase();
    return executives.filter(exec => 
      exec.name.toLowerCase().includes(term) ||
      exec.id.toString().includes(term)
    );
  };

  const handleExecutiveClick = (executive) => {
    setSelectedExecutive(executive);
    setViewMode('work');
  };

  const handleAddEntry = (executive) => {
    setSelectedExecutiveForForm(executive);
    setViewMode('add-entry');
  };

  const handleBackToTeam = () => {
    setSelectedExecutive(null);
    setSelectedExecutiveForForm(null);
    setViewMode('list');
    setSubmitSuccess(null);
  };

  const handleRefresh = () => {
    fetchTeamLeadForms();
  };

  // If in add entry mode, show the form
  if (viewMode === 'add-entry' && selectedExecutiveForForm) {
    return (
      <MainLayout user={dashboardUser} logout={logout}>
        <div className="teamlead-dashboard">
          <div className="card">
            <div className="form-header">
              <div className="form-header-left">
                <button onClick={handleBackToTeam} className="btn btn-secondary">
                  ← Back to Dashboard
                </button>
              </div>
            </div>

            {/* Success/Error Message */}
            {submitSuccess && (
              <div className={`alert ${submitSuccess.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {submitSuccess.message}
              </div>
            )}

            <VendorForm
              onSubmit={handleFormSubmit}
              locationEnabled={true}
              isSubmitting={isSubmitting}
              userCode={selectedExecutiveForForm.name}
              initialData={null}
              readOnly={false}
              teamLeadMode={true}
              executiveId={selectedExecutiveForForm.id}
            />
          </div>
        </div>
      </MainLayout>
    );
  }

  // If in work mode, show executive work view
  if (viewMode === 'work' && selectedExecutive) {
    return (
      <MainLayout user={dashboardUser} logout={logout}>
        <ExecutiveWorkView 
          executive={selectedExecutive}
          onBack={handleBackToTeam}
          onRefresh={handleRefresh}
          onAddEntry={() => handleAddEntry(selectedExecutive)}
        />
      </MainLayout>
    );
  }

  // Main team view (List Mode)
  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="teamlead-dashboard">
        {/* Header with Add Executive Button */}
        <div className="card header-card">
          <div className="header-content">
            <div className="header-left">
              <div>
                <h1>Team Lead Dashboard</h1>
                <p className="text-muted">
                  Welcome back {dashboardUser?.userCode || 'Team Lead'} 
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button
                onClick={() => setShowAddExecutiveModal(true)}
                className="btn btn-primary"
                style={{ marginRight: '10px' }}
              >
                + Add Executive
              </button>
              <button
                onClick={() => {
                  setSelectedExecutiveForForm({
                    id: dashboardUser?.id || 19,
                    name: dashboardUser?.userCode || 'Team Lead'
                  });
                  setViewMode('add-entry');
                }}
                className="btn btn-success"
              >
                + Add Entry
              </button>
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="btn btn-secondary"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Add Executive Modal */}
        {showAddExecutiveModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Add New Executive</h2>
                <button 
                  onClick={() => {
                    setShowAddExecutiveModal(false);
                    setNewExecutive({
                      executiveCode: '',
                      name: '',
                      phone: ''
                    });
                    setExecutiveAddSuccess(null);
                  }}
                  className="btn-close"
                >
                  ×
                </button>
              </div>

              {/* Success/Error Message */}
              {executiveAddSuccess && (
                <div className={`alert ${executiveAddSuccess.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  {executiveAddSuccess.message}
                </div>
              )}

              <form onSubmit={handleAddExecutive}>
                <div className="form-group">
                  <label htmlFor="executiveCode">Executive Code *</label>
                  <input
                    type="text"
                    id="executiveCode"
                    name="executiveCode"
                    value={newExecutive.executiveCode}
                    onChange={handleExecutiveInputChange}
                    placeholder="Enter executive code"
                    required
                    disabled={isAddingExecutive}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newExecutive.name}
                    onChange={handleExecutiveInputChange}
                    placeholder="Enter executive name"
                    required
                    disabled={isAddingExecutive}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newExecutive.phone}
                    onChange={handleExecutiveInputChange}
                    placeholder="Enter 10-digit phone number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                    disabled={isAddingExecutive}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddExecutiveModal(false);
                      setNewExecutive({
                        executiveCode: '',
                        name: '',
                        phone: ''
                      });
                      setExecutiveAddSuccess(null);
                    }}
                    className="btn btn-secondary"
                    disabled={isAddingExecutive}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isAddingExecutive}
                  >
                    {isAddingExecutive ? 'Adding...' : 'Add Executive'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="card">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by executive name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-secondary btn-clear"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card error-card">
            <p>{error}</p>
            <button 
              onClick={handleRefresh}
              className="btn btn-danger"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card loading-card">
            <div className="loader"></div>
            <h3>Loading team data...</h3>
          </div>
        )}

        {/* Executive List */}
        {!loading && !error && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                List of Executives ({getFilteredExecutives().length})
              </h2>
            </div>
            
            <div className="executive-list">
              {getFilteredExecutives().map(executive => (
                <div 
                  key={executive.id}
                  className="executive-card"
                >
                  <div className="executive-card-content">
                    {/* Avatar */}
                    <div className="executive-avatar">
                      {executive.name.charAt(0)}
                    </div>

                    {/* Executive Info */}
                    <div className="executive-info">
                      <h3 className="executive-name">{executive.name}</h3>
                    </div>

                    {/* Actions */}
                    <div className="executive-actions">
                      <button
                        onClick={() => handleExecutiveClick(executive)}
                        className="btn btn-primary btn-sm"
                        title="View all entries"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {getFilteredExecutives().length === 0 && (
                <div className="empty-state">
                  <p>No executives found</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="btn btn-secondary"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats Summary with Date Filter */}
        {!loading && !error && executiveForms.length > 0 && (
          <div className="card summary-card">
            <div className="summary-header">
              <h3 className="card-title">Team Summary</h3>
              
              {/* Date Filter Controls */}
              <div className="date-filter-container">
                <div className="date-filter-inputs">
                  <div className="date-filter-group">
                    <label htmlFor="startDate">Select Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={dateFilter.startDate}
                      onChange={handleDateFilterChange}
                      className="date-input"
                    />
                  </div>
                  
                  {(dateFilter.startDate || dateFilter.endDate) && (
                    <button
                      onClick={clearDateFilters}
                      className="btn btn-secondary btn-sm"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
               
              </div>
            </div>

            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-value">
                  {getExecutivesWithForms().length}
                </div>
                <div className="summary-label">Active Executives</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">
                  {filteredForms.length}
                </div>
                <div className="summary-label">Total Forms</div>
              </div>
              <div className="summary-item">
                <div className="summary-value" style={{ color: '#28a745' }}>
                  {filteredForms.filter(f => f.status === 'INTERESTED' || f.status === 'ONBOARDED').length}
                </div>
                <div className="summary-label">Successful</div>
              </div>
              <div className="summary-item">
                <div className="summary-value" style={{ color: '#dc3545' }}>
                  {filteredForms.filter(f => f.status === 'NOT_INTERESTED').length}
                </div>
                <div className="summary-label">Not Interested</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TeamLeadDashboard;