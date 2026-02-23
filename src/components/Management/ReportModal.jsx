import React, { useState } from 'react';
import { reportService } from '../../Services/report.service';

const ReportModal = ({ isOpen, onClose, forms }) => {
  const [reportType, setReportType] = useState('excel');
  const [reportPeriod, setReportPeriod] = useState('all');
  const [generating, setGenerating] = useState(false);

  
  
  if (!isOpen) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const filteredData = reportService.filterDataByPeriod(forms, reportPeriod);
      
      if (filteredData.length === 0) {
        alert('No data found for the selected period!');
        return;
      }

      if (reportType === 'excel') {
        reportService.generateExcelReport(filteredData, reportPeriod);
      } else {
        reportService.generatePDFReport(filteredData, reportPeriod);
      }

      onClose();
    } catch (error) {
      console.error('Report generation error:', error);
      alert(error.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const getFilteredCount = () => {
    return reportService.filterDataByPeriod(forms, reportPeriod).length;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={e => e.stopPropagation()}>
        <div className="report-modal-header">
          <h2>Generate Report</h2>
          <button className="close-btn" onClick={onClose} disabled={generating}>
            ×
          </button>
        </div>

        <div className="report-modal-body">
          <div className="form-group">
            <label>Report Format:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="excel"
                  checked={reportType === 'excel'}
                  onChange={(e) => setReportType(e.target.value)}
                  disabled={generating}
                />
                <span>Excel (.xlsx)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="pdf"
                  checked={reportType === 'pdf'}
                  onChange={(e) => setReportType(e.target.value)}
                  disabled={generating}
                />
                <span>PDF (.pdf)</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Time Period:</label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="period-select"
              disabled={generating}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="15days">Last 15 Days</option>
              <option value="1month">Last 1 Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="annual">Annual (12 Months)</option>
            </select>
          </div>

          <div className="info-box">
            <div className="info-row">
              <span>Selected Period:</span>
              <strong>{reportService.getPeriodLabel(reportPeriod)}</strong>
            </div>
            <div className="info-row">
              <span>Records to export:</span>
              <strong>{getFilteredCount()}</strong>
            </div>
          </div>
        </div>

        <div className="report-modal-footer">
          <button 
            className="btn btn-outline" 
            onClick={onClose}
            disabled={generating}
          >
            Cancel
          </button>
          <button 
            className="btn btn-success"
            onClick={handleGenerate}
            disabled={generating || getFilteredCount() === 0}
          >
            {generating ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              'Download Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;