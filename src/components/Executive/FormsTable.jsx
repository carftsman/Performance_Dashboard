
const StatusBadge = ({ status }) => {
  const styles = {
    INTERESTED: { bg: "#d4edda", color: "#155724", label: "Interested" },
    NOT_INTERESTED: { bg: "#f8d7da", color: "#721c24", label: "Not Interested" },
    FOLLOW_UP: { bg: "#fff3cd", color: "#856404", label: "Follow Up" },
  };

  const style = styles[status] || { bg: "#e2e3e5", color: "#383d41", label: status };

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
      }}
    >
      {style.label}
    </span>
  );
};

// Tag Badge Component
const TagBadge = ({ tag }) => {
  const styles = {
    GREEN: { bg: "#d4edda", color: "#155724" },
    ORANGE: { bg: "#fff3cd", color: "#856404" },
    YELLOW: { bg: "#fff3cd", color: "#856404" },
    RED: { bg: "#f8d7da", color: "#721c24" },
  };

  const style = styles[tag] || { bg: "#e2e3e5", color: "#383d41" };

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
      }}
    >
      {tag || "N/A"}
    </span>
  );
};

// Date Formatter
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
};

const FormsTable = ({ forms }) => {
  return (
    <>
    <style>{`
      /* Table Container */
.table-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 1rem;
  font-family: 'Arial', sans-serif;
}

/* Table Styles */
.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* allow horizontal scroll on small screens */
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.data-table td {
  font-size: 0.9rem;
  color: #444;
}

/* Zebra striping */
.data-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

/* Hover effect */
.data-table tbody tr:hover {
  background-color: #f1f3f5;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .data-table {
    min-width: 600px;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .data-table {
    min-width: 400px;
  }

  .data-table th,
  .data-table td {
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
  }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 0.95rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin-top: 1rem;
}

/* Status & Tag Badges */
.data-table td span {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* Vendor Info */
.data-table td div {
  line-height: 1.3;
}

/* Optional: make table horizontally scrollable */
.table-container::-webkit-scrollbar {
  height: 6px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}
    `}</style>
    <div className="table-container desktop-view">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Shop Name</th>
            <th>Vendor Info</th>
            <th>Location</th>
            <th>Review</th>
            <th>Status</th>
            <th>Tag</th>
          </tr>
        </thead>

        <tbody>
          {forms.map((form) => (
            <tr key={form.id}>
              {/* Date */}
              <td>{formatDate(form.createdAt || form.date)}</td>

              {/* Shop Name */}
              <td>
                <strong>{form.vendorShopName}</strong>
              </td>

              {/* Vendor Info */}
              <td>
                <div>
                  <strong>{form.vendorName}</strong>
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  📞 {form.contactNumber} <br />
                  {form.mailId && <>✉️ {form.mailId}</>}
                </div>
              </td>

              {/* Location */}
              <td>
                {form.areaName}, {form.state}
                <br />
                {form.pinCode && <span>PIN: {form.pinCode}</span>}
              </td>

              {/* Review */}
              <td>
                {form.review ? (
                  <span title={form.review}>
                    {form.review.substring(0, 30)}
                    {form.review.length > 30 && "..."}
                  </span>
                ) : (
                  "—"
                )}
              </td>

              {/* Status */}
              <td>
                <StatusBadge status={form.status} />
              </td>

              {/* Tag */}
              <td>
                <TagBadge tag={form.tag} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {forms.length === 0 && (
        <div className="empty-state">
          <p>No entries found</p>
        </div>
      )}
    </div>
   
    </>
  );
};

export default FormsTable;