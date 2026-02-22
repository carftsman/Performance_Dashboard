

const DateFilter = ({ dateFilter, onDateFilterChange, onClearFilters }) => {
  return (
    <>
    <style>
        {`
            /* Main Date Filter Container */
.date-filter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: 0.3s ease;
}

.date-filter:hover {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Date Inputs Wrapper */
.date-inputs {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

/* Each Input Group */
.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

/* Label */
.date-input-group label {
  font-size: 12px;
  color: #777;
  letter-spacing: 0.3px;
}

/* Date Input Field */
.date-input {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid #e0e0e0;
  background: #f8f9ff;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: 0.3s ease;
  min-width: 160px;
}

/* Focus Effect */
.date-input:focus {
  background: white;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.18);
}

/* Clear Filters Button */
.btn-clear-filters {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 75, 43, 0.4);
  transition: 0.25s ease;
}

.btn-clear-filters:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 18px rgba(255, 75, 43, 0.6);
}

/* ================= RESPONSIVE DESIGN ================= */

/* Tablet */
@media (max-width: 1024px) {
  .date-filter {
    padding: 12px 14px;
  }

  .date-input {
    min-width: 140px;
    font-size: 13px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .date-filter {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .date-inputs {
    width: 100%;
    justify-content: space-between;
  }

  .date-input {
    width: 100%;
    min-width: unset;
  }

  .btn-clear-filters {
    align-self: flex-end;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .date-filter {
    padding: 10px;
    border-radius: 14px;
  }

  .date-input-group label {
    font-size: 11px;
  }

  .date-input {
    padding: 8px 10px;
    font-size: 12px;
  }

  .btn-clear-filters {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
}

/* Large Screens (4K / Ultra Wide) */
@media (min-width: 1600px) {
  .date-filter {
    padding: 18px 24px;
  }

  .date-input {
    font-size: 16px;
    padding: 12px 18px;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .date-filter {
    background: rgba(25, 25, 25, 0.95);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .date-input-group label {
    color: #aaa;
  }

  .date-input {
    background: #222;
    border-color: #444;
    color: #eee;
  }

  .date-input::placeholder {
    color: #777;
  }
}
        `}
    </style>
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
        >
          ×
        </button>
      )}
    </div>
    </>
  );
};

export default DateFilter;