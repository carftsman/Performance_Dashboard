import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <div className="search-section">
      <div className="search-container">
        {/* <span className="search-icon" aria-hidden="true">🔍</span> */}
        <input
          type="text"
          placeholder="Search by executive name or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          aria-label="Search executives"
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
  );
};

export default SearchBar;