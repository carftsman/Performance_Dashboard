// ExportButtons.jsx
import React from 'react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExportButtons = ({ filteredForms = [] }) => {
  
  const handleExcelExport = () => {
    if (!filteredForms || filteredForms.length === 0) {
      alert("No data to export!");
      return;
    }
    
    try {
      const exportData = filteredForms.map(f => ({
        "Date & Time": f.createdAt ? new Date(f.createdAt).toLocaleString() : 'N/A',
        "Shop Name": f.vendorShopName || 'N/A',
        "Vendor Name": f.vendorName || 'N/A',
        "Contact Number": f.contactNumber || 'N/A',
        "Email": f.mailId || 'N/A',
        "Executive": f.executiveName || f.executiveId || 'N/A',
        "Team Lead": f.teamleadName || f.teamleadId || 'N/A',
        "Area": f.areaName || 'N/A',
        "State": f.state || 'N/A',
        "Door Number": f.doorNumber || 'N/A',
        "Street": f.streetName || 'N/A',
        "PIN Code": f.pinCode || 'N/A',
        "Status": f.status || 'N/A',
        "Tag": f.tag || 'N/A',
        "Review": f.review || 'N/A',
        "Executive Review": f.executiveReview || 'N/A',
        "Vendor Review": f.vendorReview || 'N/A',
        "Assigned BPO": f.assignedBpoName || f.assignedBpoId || 'Not Assigned',
        "BPO Action Date": f.bpoActionDate ? new Date(f.bpoActionDate).toLocaleString() : 'N/A',
        "Reappear Date": f.reappearDate ? new Date(f.reappearDate).toLocaleString() : 'N/A',
        "Solved": f.solved ? "Yes" : "No",
        "Vendor Location": f.vendorLocation || 'N/A'
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Auto-size columns
      const maxWidth = 50;
      const wscols = [];
      for (let i = 0; i < Object.keys(exportData[0] || {}).length; i++) {
        wscols.push({ wch: maxWidth });
      }
      worksheet['!cols'] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Management Data");

      // Add summary sheet
      const summaryData = [
        ['Report Generated On', new Date().toLocaleString()],
        ['Total Records', filteredForms.length.toString()],
        [],
        ['Status Summary'],
        ['Status', 'Count'],
        ...Object.entries(
          filteredForms.reduce((acc, form) => {
            const status = form.status || 'UNKNOWN';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {})
        )
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

      const fileName = `management_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error('Excel export error:', error);
      alert('Failed to export Excel file. Please try again.');
    }
  };

  const handlePDFExport = () => {
    if (!filteredForms || filteredForms.length === 0) {
      alert("No data to export!");
      return;
    }

    try {
      const doc = new jsPDF('landscape');

      // Title
      doc.setFontSize(16);
      doc.text('Management Dashboard Report', 14, 15);
      
      // Metadata
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
      doc.text(`Total Records: ${filteredForms.length}`, 14, 28);

      // Prepare columns for main table
      const columns = [
        "Date", "Shop", "Vendor", "Contact", "Executive", 
        "Team Lead", "Area", "Status", "Tag"
      ];

      const rows = filteredForms.map(f => [
        f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'N/A',
        f.vendorShopName || 'N/A',
        f.vendorName || 'N/A',
        f.contactNumber || 'N/A',
        f.executiveName || f.executiveId || 'N/A',
        f.teamleadName || f.teamleadId || 'N/A',
        f.areaName || 'N/A',
        f.status || 'N/A',
        f.tag || 'N/A'
      ]);

      // Main table
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 35,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 35 },
      });

      doc.save(`management_report_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF file. Please try again.');
    }
  };

  return (
    <div className="export-buttons">
      <button 
        onClick={handleExcelExport}
        className="btn btn-success"
        disabled={!filteredForms || filteredForms.length === 0}
        title={filteredForms?.length === 0 ? "No data to export" : "Export to Excel"}
      >
        📊 Excel
      </button>
      <button 
        onClick={handlePDFExport}
        className="btn btn-danger"
        disabled={!filteredForms || filteredForms.length === 0}
        title={filteredForms?.length === 0 ? "No data to export" : "Export to PDF"}
      >
        📄 PDF
      </button>
    </div>
  );
};

export default ExportButtons;