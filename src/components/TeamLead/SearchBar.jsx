

const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <>
        <style>{`
        /* Main Search Card */
.search-section {
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  padding: 14px 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(253, 251, 251, 0.06);
  transition: 0.3s ease;
}

.search-section:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Search Container */
.search-container {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

/* Search Icon */
.search-icon {
  font-size: 20px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.12);
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.search-section:hover .search-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

/* Search Input */
.search-input {
  flex: 1;
  padding: 14px 16px;
  border-radius: 14px;
  border: none;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  background: #f8f9ff;
  color: #333;
  transition: 0.3s ease;
}

.search-input::placeholder {
  color: #999;
  font-weight: 400;
}

/* Focus Effect */
.search-input:focus {
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

/* Clear Button */
.search-clear {
  position: absolute;
  right: 12px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 75, 43, 0.4);
  transition: 0.25s ease;
}

.search-clear:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 75, 43, 0.6);
}

/* ================== RESPONSIVE DESIGN ================== */

/* Tablet */
@media (max-width: 1024px) {
  .search-section {
    padding: 12px 14px;
  }

  .search-input {
    font-size: 14px;
    padding: 12px 14px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .search-container {
    gap: 8px;
  }

  .search-icon {
    font-size: 18px;
    padding: 8px;
  }

  .search-input {
    font-size: 14px;
    padding: 12px;
  }

  .search-clear {
    width: 22px;
    height: 22px;
    font-size: 14px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .search-section {
    padding: 10px;
    border-radius: 14px;
  }

  .search-input {
    font-size: 13px;
    padding: 10px 12px;
  }

  .search-icon {
    font-size: 16px;
    padding: 6px;
  }
}

/* Large Screens (4K, Ultra Wide) */
@media (min-width: 1600px) {
  .search-section {
    padding: 18px 24px;
  }

  .search-input {
    font-size: 17px;
    padding: 16px 20px;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .search-section {
    background: rgba(30, 30, 30, 0.9);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .search-input {
    background: #222;
    color: #eee;
  }

  .search-input::placeholder {
    color: #777;
  }
}
        `}</style>
         <div className="search-section card">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by executive name or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="search-clear"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
    </>
   
  );
};

export default SearchBar;