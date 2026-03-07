import './FormsTable.css';
import { useState, useEffect } from 'react';

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

// ── Detail Row helper for the bottom sheet ──
const SheetRow = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="ft-detail-row">
      <span className="ft-detail-label">{label}</span>
      <span className="ft-detail-value">{value}</span>
    </div>
  );
};

// ── Bottom Sheet Modal (mobile only) ──
const FormBottomSheet = ({ form, onClose }) => {
  // Prevent body scroll while sheet is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const location = [
    form.areaName,
    form.state,
    form.pinCode ? `PIN: ${form.pinCode}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        className="ft-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className="ft-bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${form.vendorShopName}`}
      >
        {/* Drag handle bar (visual cue) */}
        <div className="ft-sheet-handle" />

        {/* Sheet Header */}
        <div className="ft-sheet-header">
          <div className="ft-sheet-title-row">
            <span className="ft-sheet-shop-name">{form.vendorShopName}</span>
            <button
              className="ft-sheet-close-btn"
              onClick={onClose}
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
          <div className="ft-sheet-badges">
            <StatusBadge status={form.status} />
            <TagBadge tag={form.tag} />
          </div>
        </div>

        {/* Sheet Body — all fields */}
        <div className="ft-sheet-body">
          <SheetRow label="Vendor Name"    value={form.vendorName} />
          <SheetRow label="Contact"        value={form.contactNumber} />
          <SheetRow label="Email"          value={form.mailId} />
          <SheetRow label="Location"       value={location} />
          <SheetRow label="Review"         value={form.review} />
          <SheetRow
            label="Date & Time"
            value={formatDate(form.createdAt || form.date)}
          />
        </div>
      </div>
    </>
  );
};

const FormsTable = ({ forms }) => {
  const [activeForm, setActiveForm] = useState(null);

  const openSheet  = (form) => setActiveForm(form);
  const closeSheet = ()     => setActiveForm(null);

  return (
    <div className="forms-section">
      {/* ── Desktop Table View (unchanged) ── */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date &amp; Time</th>
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

      {/* ── Mobile Compact Cards (tap to expand) ── */}
      <div className="mobile-cards-container">
        {forms.map((form) => (
          <div
            key={form.id}
            className="mobile-form-card ft-compact-card"
            onClick={() => openSheet(form)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openSheet(form)}
            aria-label={`View details for ${form.vendorShopName}`}
          >
            {/* Top row: shop name + status */}
            <div className="ft-compact-header">
              <span className="ft-compact-shop-name">{form.vendorShopName}</span>
              <StatusBadge status={form.status} />
            </div>

            {/* Middle: vendor name */}
            <div className="ft-compact-vendor">{form.vendorName}</div>

            {/* Bottom row: date + tap hint */}
            <div className="ft-compact-footer">
              <span className="ft-compact-date">
                {formatDate(form.createdAt || form.date)}
              </span>
              <span className="ft-tap-hint">Tap for details ›</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Sheet Modal ── */}
      {activeForm && (
        <FormBottomSheet form={activeForm} onClose={closeSheet} />
      )}

      {forms.length === 0 && (
        <div className="empty-state">
          <p>No entries found</p>
        </div>
      )}
    </div>
  );
};

export default FormsTable;