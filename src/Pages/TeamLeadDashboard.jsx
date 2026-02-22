import React, { useState, useEffect } from "react";
import MainLayout from "../components/common/Layout/MainLayout";
import ExecutiveWorkView from '../components/Executive/ExecutiveWorkView';
import LocationForm from "../components/Executive/LocationForm";
import teamLeadService from "../Services/teamlead.service";
import DashboardHeader from "../components/TeamLead/DashboardHeader";
import AddExecutiveModal from "../components/TeamLead/AddExecutiveModal";
import SearchBar from "../components/TeamLead/SearchBar";
import ExecutiveList from "../components/TeamLead/ExecutiveList";
import TeamSummary from "../components/TeamLead/TeamSummary";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useNavigate } from "react-router-dom";
import "./TeamLeadDashboard.css";

const TeamLeadDashboard = ({ user, logout }) => {
  const navigate = useNavigate();

  // Safe user load
  const dashboardUser =
    user || JSON.parse(localStorage.getItem("user") || "{}");

  const [viewMode, setViewMode] = useState("list");
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [selectedExecutiveForForm, setSelectedExecutiveForForm] = useState(null);

  const [executiveForms, setExecutiveForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [showAddExecutiveModal, setShowAddExecutiveModal] = useState(false);

  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch forms
  useEffect(() => {
    fetchTeamLeadForms();
  }, []);

  // Filter by date
  useEffect(() => {
    filterFormsByDate();
  }, [executiveForms, dateFilter]);

  const fetchTeamLeadForms = async () => {
    try {
      setLoading(true);
      const data = await teamLeadService.getForms();
      const formsData = Array.isArray(data) ? data : [];
      setExecutiveForms(formsData);
      setFilteredForms(formsData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load team data");
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

    const filtered = executiveForms.filter((form) => {
      const formDate = new Date(form.createdAt || form.date || new Date());

      if (dateFilter.startDate) {
        const start = new Date(dateFilter.startDate);
        if (formDate < start) return false;
      }

      if (dateFilter.endDate) {
        const end = new Date(dateFilter.endDate);
        end.setHours(23, 59, 59, 999);
        if (formDate > end) return false;
      }

      return true;
    });

    setFilteredForms(filtered);
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));
  };

  const clearDateFilters = () => {
    setDateFilter({ startDate: "", endDate: "" });
  };

  // Submit form entry
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitSuccess(null);

      const submissionData = {
        ...formData,
        teamleadId: dashboardUser?.id || 1,
        teamleadName: dashboardUser?.userCode || "TeamLead",
        executiveId: selectedExecutiveForForm?.id,
        executiveName: selectedExecutiveForForm?.name,
      };

      console.log("Submitting:", submissionData);

      await teamLeadService.addForm(submissionData); // 🔥 change based on API

      setSubmitSuccess({ type: "success", message: "Entry added successfully!" });
      await fetchTeamLeadForms();

      setTimeout(() => {
        setViewMode("list");
        setSelectedExecutiveForForm(null);
        setSubmitSuccess(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      setSubmitSuccess({
        type: "error",
        message: "Failed to add entry",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group forms by executive
  const getExecutivesWithForms = () => {
    const map = new Map();

    filteredForms.forEach((form) => {
      const id = form.executiveId;
      if (!map.has(id)) {
        map.set(id, {
          id,
          name: form.executiveName || `Executive ${id}`,
          forms: [],
          stats: { total: 0, interested: 0, onboarded: 0, notInterested: 0 },
        });
      }

      const exec = map.get(id);
      exec.forms.push(form);
      exec.stats.total++;

      if (form.status === "INTERESTED") exec.stats.interested++;
      if (form.status === "ONBOARDED") exec.stats.onboarded++;
      if (form.status === "NOT_INTERESTED") exec.stats.notInterested++;
    });

    return [...map.values()];
  };

  const getFilteredExecutives = () => {
    const executives = getExecutivesWithForms();
    if (!searchTerm.trim()) return executives;

    const term = searchTerm.toLowerCase();
    return executives.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.id.toString().includes(term)
    );
  };

  const handleExecutiveClick = (executive) => {
    setSelectedExecutive(executive);
    setViewMode("work");
  };

  const handleAddEntry = (executive) => {
    setSelectedExecutiveForForm(executive);
    setViewMode("add-entry");
  };

  const handleBackToTeam = () => {
    setViewMode("list");
    setSelectedExecutive(null);
    setSelectedExecutiveForForm(null);
  };

  const handleRefresh = () => fetchTeamLeadForms();

  const handleAddEntryNavigation = () => {
    navigate("/executive");
  };

  // ================= ADD ENTRY VIEW =================
  if (viewMode === "add-entry" && selectedExecutiveForForm) {
    return (
      <MainLayout user={dashboardUser} logout={logout}>
        <div className="teamlead-dashboard">
          <div className="card">
            <button onClick={handleBackToTeam} className="btn btn-outline">
              ← Back
            </button>

            {submitSuccess && (
              <div className={`alert alert-${submitSuccess.type}`}>
                {submitSuccess.message}
              </div>
            )}

            <LocationForm
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              userCode={selectedExecutiveForForm.name}
              teamLeadMode={true}
              executiveId={selectedExecutiveForForm.id}
            />
          </div>
        </div>
      </MainLayout>
    );
  }

  // ================= WORK VIEW =================
  if (viewMode === "work" && selectedExecutive) {
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

  // ================= DASHBOARD MAIN VIEW =================
  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="teamlead-dashboard">
        <DashboardHeader
          user={dashboardUser}
          onAddExecutive={() => setShowAddExecutiveModal(true)}
          onAddEntry={handleAddEntryNavigation}
          onRefresh={handleRefresh}
          loading={loading}
        />

        <AddExecutiveModal
          isOpen={showAddExecutiveModal}
          onClose={() => setShowAddExecutiveModal(false)}
          onExecutiveAdded={fetchTeamLeadForms}
        />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClear={() => setSearchTerm("")}
        />

        {error && <ErrorState message={error} onRetry={handleRefresh} />}

        {loading && <LoadingState />}

        {!loading && !error && (
          <ExecutiveList
            executives={getFilteredExecutives()}
            onExecutiveClick={handleExecutiveClick}
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm("")}
          />
        )}

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
    </MainLayout>
  );
};

export default TeamLeadDashboard;