const FiltersBar = ({
  searchTerm,
  setSearchTerm,
  teamFilter,
  setTeamFilter,
  dateRange,
  setDateRange,
  teamLeads=[],
  clearFilters,
  filteredCount,
  totalCount
}) => {
  return (
    <div className="card filters-card">
      <div className="filters-grid">
        <input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
          <option value="all">All Team Leads</option>
          {teamLeads.map(t => <option key={t}>{t}</option>)}
          
        </select>

        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>

        <button onClick={clearFilters}>Clear</button>
      </div>

      <div>Showing {filteredCount} of {totalCount}</div>
    </div>
  );
};

export default FiltersBar;