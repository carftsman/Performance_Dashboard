
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import ExecutiveWorkView from '../components/TeamLead/ExecutiveWorkView';
import LocationForm from '../components/Executive/LocationForm';
import axios from 'axios';
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

  // Fetch all forms for the team lead
  useEffect(() => {
    fetchTeamLeadForms();
  }, []);

  const fetchTeamLeadForms = async () => {
    try {
      setLoading(true);
      console.log('Calling API');
      
      const response = await axios.get(
        "https://mft-zwy7.onrender.com/api/teamlead/forms",
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true 
        }
      );

      console.log("Team Lead Forms:", response.data);
      
      const formsData = Array.isArray(response.data) ? response.data : [];
      setExecutiveForms(formsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching team lead forms:", error);
      setError("Failed to load team data. Please try again.");
      setExecutiveForms([]);
    } finally {
      setLoading(false);
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

  // Group forms by executive
  const getExecutivesWithForms = () => {
    const execMap = new Map();
    
    executiveForms.forEach(form => {
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
                <div className="form-title">
                  <h2>Add New Entry for {selectedExecutiveForForm.name}</h2>
                  <p className="text-muted">Executive ID: {selectedExecutiveForForm.id}</p>
                </div>
              </div>
            </div>

            {/* Success/Error Message */}
            {submitSuccess && (
              <div className={`alert ${submitSuccess.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {submitSuccess.message}
              </div>
            )}

            <LocationForm
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
        {/* Header */}
        <div className="card header-card">
          <div className="header-content">
            <div className="header-left">
              <div>
                <h1>Team Lead Dashboard</h1>
                <p className="text-muted">
                  Welcome back  {dashboardUser?.userCode || 'Team Lead'} 
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

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
                List of Execuitves
                {/* List of Executives ({getFilteredExecutives().length}) */}
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

        {/* Quick Stats Summary */}
        {!loading && !error && executiveForms.length > 0 && (
          <div className="card summary-card">
            <h3 className="card-title">Team Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-value">
                  {getExecutivesWithForms().length}
                </div>
                <div className="summary-label">Total Executives</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">
                  {executiveForms.length}
                </div>
                <div className="summary-label">Total Forms</div>
              </div>
              <div className="summary-item">
                <div className="summary-value" style={{ color: '#28a745' }}>
                  {executiveForms.filter(f => f.status === 'INTERESTED' || f.status === 'ONBOARDED').length}
                </div>
                <div className="summary-label">Successful</div>
              </div>
              <div className="summary-item">
                <div className="summary-value" style={{ color: '#dc3545' }}>
                  {executiveForms.filter(f => f.status === 'NOT_INTERESTED').length}
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