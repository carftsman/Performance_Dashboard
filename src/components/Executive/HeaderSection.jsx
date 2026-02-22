const HeaderSection = ({ executive, onBack }) => {
  return (
    <>
    <style>
        {`
        /* Header Card */
.header-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px;
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Title */
.header-card h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

/* Subtitle */
.header-card p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

/* Back Button */
.header-card .btn {
  width: fit-content;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

/* Remove default focus outline */
.header-card .btn:focus {
  outline: none;
}

/* ================= Responsive ================= */

/* Tablet & Desktop */
@media (min-width: 768px) {
  .header-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .header-card h2 {
    font-size: 22px;
  }
}

/* Large Screens */
@media (min-width: 1200px) {
  .header-card {
    padding: 22px 28px;
  }

  .header-card h2 {
    font-size: 24px;
  }
}
        `}
    </style>
    <div className="card header-card">
      <h2>{executive.name} -  Id:{executive.id} </h2>
      <button onClick={onBack} className="btn">← Back</button>
    </div>
    </>
  );
};

export default HeaderSection;