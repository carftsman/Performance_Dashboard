import React from "react";

const FormsGrid = ({
  filteredForms = [],
  toggleRowExpand,
  getStatusBadge,
  getTagBadge,
  formatDate,
}) => {
  return (
    <div className="mgmt-grid">
      {filteredForms.map((form) => (
        <div
          key={form.id}
          className="mgmt-card"
          onClick={() => toggleRowExpand(form.id)}
        >
          {/* HEADER */}
          <div className="mgmt-card-header">
            <h3 className="mgmt-shop-name">
              {form.vendorShopName || "Unnamed Shop"}
            </h3>

            <div className="mgmt-badges">
              {getStatusBadge?.(form.status)}
              {getTagBadge?.(form.tag)}
            </div>
          </div>

          {/* BODY */}
          <div className="mgmt-card-body">
            <p className="mgmt-vendor-name">
              {form.vendorName || "No Vendor Name"}
            </p>

            <div className="mgmt-card-meta">
              <span>👤 {form.executiveName || `ID: ${form.executiveId}`}</span>
              <span>
                📍 {form.areaName || "N/A"}, {form.state || "N/A"}
              </span>
              <span>📅 {formatDate?.(form.createdAt)}</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mgmt-card-footer">
            <span className="mgmt-view-btn">View Details →</span>
          </div>
        </div>
      ))}

      {/* EMPTY STATE */}
      {filteredForms.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Forms Found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default FormsGrid;