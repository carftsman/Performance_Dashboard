const FilterSection = ({ filterType, setFilterType, customDate, setCustomDate, filteredCount, getTodayDate }) => {
  return (

    <>
   <style>{`
   .filter-card {
  padding: 12px 16px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e5e7eb;
}

.calendar-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.calendar-filter label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.calendar-filter input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

.result-count {
  font-size: 13px;
  color: #2563eb;
  font-weight: 500;
}

/* Mobile responsive */
@media (max-width: 600px) {
  .calendar-filter {
    flex-direction: column;
    align-items: flex-start;
  }

  .calendar-filter input {
    width: 100%;
  }
}`}</style>
   <div className="card filter-card">
      <div className="calendar-filter">
        <label>Select Date:</label>

        <input
          type="date"
          value={customDate}
          max={getTodayDate()}
          onChange={(e) => setCustomDate(e.target.value)}
        />

      
      </div>
    </div>
      </>
  );
};

export default FilterSection;