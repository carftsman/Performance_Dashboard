import './DateFilter.css';

const DateFilter = ({ dateFilter, onDateFilterChange, onClearFilters }) => {
  return (
    <div className="date-filter">
      <div className="date-inputs">
        <div className="date-input-group">
          <label htmlFor="filterStartDate">Select Date</label>
          <input
            type="date"
            id="filterStartDate"
            name="startDate"
            value={dateFilter.startDate}
            onChange={onDateFilterChange}
            className="date-input"
          />
        </div>
      </div>

      {(dateFilter.startDate || dateFilter.endDate) && (
        <button
          onClick={onClearFilters}
          className="btn-clear-filters"
          title="Clear filters"
          aria-label="Clear date filters"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default DateFilter;