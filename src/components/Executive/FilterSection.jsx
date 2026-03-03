import './FilterSection.css';
const FilterSection = ({
  filterType,
  onFilterChange,
  customDate,
  onDateChange,
  getTodayDate,
}) => {
  return (
    <>
      <div className="card filter-card">
        <div className="filter-container">
          <div className="filter-buttons">
            {["all", "day", "week", "month"].map((type) => (
              <button
                key={type}
                className={`filter-btn ${filterType === type ? "active" : ""}`}
                onClick={() => onFilterChange(type)}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      {filterType === "day" && (
            <div className="date-picker-container">
              <input
                type="date"
                value={customDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="date-picker"
                max={getTodayDate()}
              />
            </div>
          )}
    </>
  );
};

export default FilterSection;