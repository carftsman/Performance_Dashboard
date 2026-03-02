
const FilterSection = ({
  filterType,
  onFilterChange,
  customDate,
  onDateChange,
  getTodayDate,
}) => {
  return (
    <>
      <style>
        {`
        .filter-card {
          padding: 14px;
          background: white;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }

        .filter-container {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: space-between;
          align-items: center;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          font-size: 13px;
          cursor: pointer;
        }

        .filter-btn.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .date-picker-container {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .date-picker {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          font-size: 13px;
        }

        .filter-results-count {
          font-size: 13px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .filter-container {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        `}
      </style>

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

          {filterType !== "all" && (
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
        </div>
      </div>
    </>
  );
};

export default FilterSection;