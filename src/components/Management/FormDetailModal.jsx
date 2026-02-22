import React from "react";

const FormDetailModal = ({
  expandedRow,
  setExpandedRow,
  forms = [],
  getStatusBadge,
  getTagBadge,
  formatDate,
}) => {
  if (!expandedRow) return null;

  const form = forms.find((f) => f.id === expandedRow);
  if (!form) return null;

  return (
    <div
      className="mgmt-detail-modal-overlay"
      onClick={() => setExpandedRow(null)}
    >
      <div
        className="mgmt-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="mgmt-detail-header">
          <div>
            <h2>{form.vendorShopName || "Unnamed Shop"}</h2>
            <p className="text-muted">
              ID: {form.id} • Submitted: {formatDate(form.createdAt)}
            </p>
          </div>

          <button className="mgr-close-btn" onClick={() => setExpandedRow(null)}>
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="mgmt-detail-body">
          {/* STATUS STRIP */}
          <div className="mgmt-detail-strip">
            <div className="strip-item">
              <span className="strip-label">Status</span>
              {getStatusBadge?.(form.status)}
            </div>

            <div className="strip-item">
              <span className="strip-label">Priority Tag</span>
              {getTagBadge?.(form.tag)}
            </div>

            <div className="strip-item">
              <span className="strip-label">Solved</span>
              <span className="info-value">
                {form.solved !== null
                  ? form.solved
                    ? "✅ Yes"
                    : "❌ No"
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* GRID */}
          <div className="mgmt-detail-grid">
            {/* Vendor Info */}
            <Section title="Vendor Information">
              <Row label="Owner Name" value={form.vendorName} />
              <Row label="Contact Number" value={form.contactNumber} />
              <Row label="Email Address" value={form.mailId} />
            </Section>

            {/* Executive Info */}
            <Section title="Executive & Team">
              <Row label="Executive" value={form.executiveName || `ID: ${form.executiveId}`} />
              <Row label="Team Lead" value={form.teamleadName || `ID: ${form.teamleadId}`} />
              <Row label="Assigned BPO" value={form.assignedBpoName || form.assignedBpoId || "Not Assigned"} />
            </Section>

            {/* Location */}
            <Section title="Location Details" full>
              <InlineRow label="Door No" value={form.doorNumber} />
              <InlineRow label="Street" value={form.streetName} />
              <InlineRow label="Area" value={form.areaName} />
              <InlineRow label="State" value={form.state} />
              <InlineRow label="PIN" value={form.pinCode} />
              <InlineRow label="GPS" value={form.vendorLocation} />
            </Section>

            {/* Reviews */}
            <Section title="Reviews & Actions" full>
              {form.review && <ReviewBox title="General Review" text={form.review} />}
              {form.executiveReview && <ReviewBox title="Executive Review" text={form.executiveReview} />}
              {form.vendorReview && <ReviewBox title="Vendor Review" text={form.vendorReview} />}

              <div className="action-dates">
                <DateBadge
                  label="BPO Action Date"
                  value={form.bpoActionDate ? formatDate(form.bpoActionDate) : "Pending"}
                />
                <DateBadge
                  label="Reappear Date"
                  value={form.reappearDate ? formatDate(form.reappearDate) : "Not Set"}
                />
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ====== SMALL REUSABLE UI COMPONENTS ====== */

const Section = ({ title, children, full }) => (
  <div className={`mgmt-detail-section ${full ? "full-width" : ""}`}>
    <h3>{title}</h3>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value || "N/A"}</span>
  </div>
);

const InlineRow = ({ label, value }) => (
  <div className="detail-row-inline">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value || "N/A"}</span>
  </div>
);

const ReviewBox = ({ title, text }) => (
  <div className="review-box">
    <strong>{title}:</strong>
    <p>{text}</p>
  </div>
);

const DateBadge = ({ label, value }) => (
  <div className="date-badge">
    <span className="date-label">{label}:</span>
    <span>{value}</span>
  </div>
);

export default FormDetailModal;