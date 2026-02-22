const ReportModal = ({ show, onClose, onDownload }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Generate Report</h3>
        <button onClick={onClose}>Close</button>
        <button onClick={onDownload}>Download</button>
      </div>
    </div>
  );
};

export default ReportModal;