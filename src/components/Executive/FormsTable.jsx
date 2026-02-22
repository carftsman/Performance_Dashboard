// const FormsTable = ({ forms }) => {
//   return (
//     <div className="desktop-view">
//       <table className="data-table">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Shop</th>
//             <th>Vendor</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {forms.map(f => (
//             <tr key={f.id}>
//               <td>{new Date(f.createdAt).toLocaleDateString()}</td>
//               <td>{f.vendorShopName}</td>
//               <td>{f.vendorName}</td>
//               <td>{f.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FormsTable;
import React from "react";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    INTERESTED: { bg: "#d4edda", color: "#155724", label: "Interested" },
    ONBOARDED: { bg: "#cce5ff", color: "#004085", label: "Onboarded" },
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
  });
};

const FormsTable = ({ forms }) => {
  return (
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
  );
};

export default FormsTable;