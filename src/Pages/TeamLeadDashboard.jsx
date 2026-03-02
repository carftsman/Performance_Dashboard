import React, { useState, useEffect } from 'react';
import teamLeadService  from '../Services/teamlead.service';
import './TeamLeadDashboard.css'; 
import './ExecutiveDashboard.css';
import ExecutiveWorkViewTL from '../components/Executive/ExecutiveWorkView';
import TeamSummary from '../components/TeamLead/TeamSummary';
import ExecutiveList from '../components/TeamLead/ExecutiveList';
import LoadingState from '../components/common/LoadingState';
import AddExecutiveModal from '../components/TeamLead/AddExecutiveModal';
import SearchBar from '../components/TeamLead/SearchBar';
import AddEntryView from '../components/Executive/AddEntryView';

const TeamLeadDashboard = ({ user, logout }) => {
  const dashboardUser = user || JSON.parse(localStorage.getItem('user'));
  const [viewMode, setViewMode] = useState('list'); 
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [executiveForms, setExecutiveForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [selectedExecutiveForForm, setSelectedExecutiveForForm] = useState(null);
  const [showAddExecutiveModal, setShowAddExecutiveModal] = useState(false);
  
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [filteredForms, setFilteredForms] = useState([]);
  const [locationAllowed, setLocationAllowed] = useState(false);
const [workStarted, setWorkStarted] = useState(false);
const [workStartLocation, setWorkStartLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
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

const filterFormsByDate = () => {
  if (!dateFilter.startDate && !dateFilter.endDate) {
    setFilteredForms(executiveForms);
    return;
  }

  const filtered = executiveForms.filter(form => {
    if (!form.createdAt) return false;
    
    // Get just the date part from the form (YYYY-MM-DD)
    // This works because backend dates are in UTC format
    const formDateStr = form.createdAt.split('T')[0];
    
    if (dateFilter.startDate && dateFilter.endDate) {
      // Compare date strings directly (YYYY-MM-DD)
      return formDateStr >= dateFilter.startDate && 
             formDateStr <= dateFilter.endDate;
    } 
    else if (dateFilter.startDate) {
      // For single date selection (like "today")
      // Compare the date strings directly
      return formDateStr === dateFilter.startDate;
    } 
    else if (dateFilter.endDate) {
      return formDateStr <= dateFilter.endDate;
    }
    
    return true;
  });

  console.log("Date filter applied:", {
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
    totalForms: executiveForms.length,
    filteredForms: filtered.length,
    sampleDates: filtered.slice(0, 3).map(f => f.createdAt)
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

  const fetchExecutives = async () => {
    try {
      const res = await teamLeadService.getExecutives();
      setExecutives(res.data);
    } catch (err) {
      console.error("Failed to fetch executives", err);
    }
  };

  const handleEnableLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationAllowed(true);
        alert("Location Permission Granted ✅");
      },
      () => alert("Location Permission Denied ❌")
    );
  };

  const handleStartWork = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const startLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };

        setWorkStartLocation(startLocation);
        setWorkStarted(true);
        // If we want to automatically open the entry form for the TL themselves
        setSelectedExecutiveForForm({
          id: dashboardUser?.id,
          name: dashboardUser?.userCode,
        });
        setViewMode("add-entry");
      },
      () => alert("Unable to fetch start location")
    );
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await teamLeadService.createForm(formData); // 🔥 REAL API

      console.log("API Response:", res);
      setSubmitSuccess(null);

      // Add team lead information to form data
      const submissionData = {
        ...formData,
        teamleadId: dashboardUser?.id , 
        teamleadName: dashboardUser?.userCode,
        executiveId: selectedExecutiveForForm?.id,
        executiveName: selectedExecutiveForForm?.name
      };

      console.log('Submitting form:', submissionData);
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

 
  const renderNavbar = () => (
    <nav className="exec-navbar">
      <div className="exec-navbar-brand">
        <div className="exec-navbar-brand-icon">👤</div>
        <div>
          <div className="exec-navbar-brand-text">{dashboardUser?.userCode || dashboardUser?.name || "Team Lead"}</div>
          <div className="exec-navbar-brand-sub">Team Lead · Field Management</div>
        </div>
      </div>

      <div className="exec-navbar-actions">
        <button onClick={() => setShowAddExecutiveModal(true)} className="exec-btn exec-btn--new-entry">
          Add Executive
        </button>

        {!locationAllowed && (
          <button className="exec-btn exec-btn--location" onClick={handleEnableLocation}>
            📍 Enable Location
          </button>
        )}

        {!workStarted && (
          <button
            className="exec-btn exec-btn--start"
            disabled={!locationAllowed}
            onClick={handleStartWork}
            title={!locationAllowed ? "Enable location first" : "Start your work session"}
          >
            ▶ Start Work
          </button>
        )}

        {workStarted && viewMode !== 'add-entry' && (
          <button
            className="exec-btn exec-btn--new-entry"
            onClick={() => {
              setSelectedExecutiveForForm({
                id: dashboardUser?.id,
                name: dashboardUser?.userCode,
              });
              setViewMode("add-entry");
            }}
          >
            + New Entry
          </button>
        )}

        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="exec-btn exec-btn--location"
        >
          {loading ? "..." : "🔄 Refresh"}
        </button>

        <button className="exec-btn exec-btn--logout" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );

  if (viewMode === "add-entry" && selectedExecutiveForForm) {
    return (
      <div className="exec-page">
        {renderNavbar()}
        <main className="exec-main">
          <AddEntryView
            dashboardUser={dashboardUser}
            logout={logout}
            selectedExecutive={selectedExecutiveForForm}
            onBack={handleBackToTeam}
            submitSuccess={submitSuccess}
            handleFormSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            locationAllowed={locationAllowed}
            setLocationAllowed={setLocationAllowed}
            workStarted={workStarted}
            setWorkStarted={setWorkStarted}
            setWorkStartLocation={setWorkStartLocation}
            setIsSubmitting={setIsSubmitting}
          />
        </main>
      </div>
    );
  }

  // If in work mode, show executive work view
  if (viewMode === 'work' && selectedExecutive) {
    return (
      <div className="exec-page">
        {renderNavbar()}
        <main className="exec-main">
          <ExecutiveWorkViewTL 
            executive={selectedExecutive}
            onBack={handleBackToTeam}
            onRefresh={handleRefresh}
            onAddEntry={() => handleAddEntry(selectedExecutive)}
          />
        </main>
      </div>
    );
  }

  // Main team view (List Mode)
  return (
    <div className="exec-page">
      {renderNavbar()}
      
      <main className="exec-main">
        <div className="teamlead-dashboard">
          <AddExecutiveModal
            isOpen={showAddExecutiveModal}
            onClose={() => setShowAddExecutiveModal(false)}
            onExecutiveAdded={fetchExecutives}
          />

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
          />

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
            <LoadingState/>
          )}

          {/* Executive List */}
          {!loading && !error && (
            <ExecutiveList
              executives={getFilteredExecutives()}
              onExecutiveClick={handleExecutiveClick}
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
            />
          )}

          {/* Quick Stats Summary with Date Filter */}
          {!loading && !error && executiveForms.length > 0 && (
            <TeamSummary
              executives={getExecutivesWithForms()}
              totalForms={filteredForms.length}
              successfulForms={filteredForms.filter(
                (f) => f.status === "INTERESTED" || f.status === "ONBOARDED"
              ).length}
              notInterestedForms={filteredForms.filter(
                (f) => f.status === "NOT_INTERESTED"
              ).length}
              dateFilter={dateFilter}
              onDateFilterChange={handleDateFilterChange}
              onClearDateFilters={clearDateFilters}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default TeamLeadDashboard;