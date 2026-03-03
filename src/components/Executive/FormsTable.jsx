import './FormsTable.css';
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
    <div className="forms-section">
      {/* Desktop Table View */}
      <div className="table-wrapper">
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
      </div>

      {/* Mobile Cards View */}
      <div className="mobile-cards-container">
        {forms.map((form) => (
          <div key={form.id} className="mobile-form-card">
            <div className="card-header">
              <span className="shop-name">{form.vendorShopName}</span>
              <StatusBadge status={form.status} />
            </div>
            
            <div className="card-body">
              <div className="card-item">
                <span className="item-label">Vendor</span>
                <span className="item-value">{form.vendorName}</span>
              </div>
              <div className="card-item">
                <span className="item-label">Contact</span>
                <span className="item-value">{form.contactNumber}</span>
              </div>
              <div className="card-item" style={{ gridColumn: "span 2" }}>
                <span className="item-label">Location</span>
                <span className="item-value">{form.areaName}, {form.state} {form.pinCode && `(PIN: ${form.pinCode})`}</span>
              </div>
              {form.review && (
                <div className="card-item" style={{ gridColumn: "span 2" }}>
                  <span className="item-label">Review</span>
                  <span className="item-value">{form.review}</span>
                </div>
              )}
            </div>

            <div className="card-footer">
              <span className="item-value" style={{ fontSize: "12px", color: "#64748b" }}>
                {formatDate(form.createdAt || form.date)}
              </span>
              <TagBadge tag={form.tag} />
            </div>
          </div>
        ))}
      </div>

      {forms.length === 0 && (
        <div className="empty-state">
          <p>No entries found</p>
        </div>
      )}
    </div>
  );
};

export default FormsTable;