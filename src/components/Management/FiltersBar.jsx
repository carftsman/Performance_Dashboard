// FiltersBar.jsx
import React from 'react';
import ExportButtons from '../common/ExportButtons';

const FiltersBar = ({
  filteredForms,
  searchTerm,
  setSearchTerm,
  teamFilter,
  setTeamFilter,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  teamLeads = [],
  clearFilters,
  filteredCount = 0,
  totalCount = 0
}) => {
  const isFilterActive =
    searchTerm ||
    statusFilter !== "all" ||
    teamFilter !== "all" ||
    dateRange !== "all";

  // Debug log to check if filteredForms is being received
  console.log('FiltersBar received filteredForms:', filteredForms?.length);

  return (
    <div className="card filters-card">
      <div className="filters-grid">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by shop, vendor, executive..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />

        {/* Status Filter - Add this if you want status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="INTERESTED">Interested</option>
          <option value="ONBOARDED">Onboarded</option>
          <option value="NOT_INTERESTED">Not Interested</option>
        </select>

        {/* Team Leads */}
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Team Leads</option>
          {teamLeads?.map((lead) => (
            <option key={lead} value={lead}>
              {lead}
            </option>
          ))}
        </select>

        {/* Date Filter */}
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

        {/* Export Buttons - Pass filteredForms here */}
        <ExportButtons filteredForms={filteredForms} />

        {/* Clear Filters */}
        {isFilterActive && (
          <button onClick={clearFilters} className="btn btn-outline">
            Clear Filters
          </button>
        )}
      </div>

      {/* Result Count */}
      <div className="results-count">
        Showing {filteredCount} of {totalCount} entries
      </div>
    </div>
  );
};

export default FiltersBar;