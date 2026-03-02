import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportExcel = (filteredForms = []) => {
 

  const exportData = filteredForms.map(f => ({
    "Date & Time": f.createdAt,
    "Shop Name": f.vendorShopName,
    "Vendor Name": f.vendorName,
    "Contact Number": f.contactNumber,
    "Email": f.mailId,
    "Executive": f.executiveName,
    "Team Lead": f.teamleadName,
    "Area": f.areaName,
    "State": f.state,
    "Door Number": f.doorNumber,
    "Street": f.streetName,
    "PIN Code": f.pinCode,
    "Status": f.status,
    "Tag": f.tag,
    "Review": f.review,
    "Executive Review": f.executiveReview,
    "Vendor Review": f.vendorReview,
    "Assigned BPO": f.assignedBpoId,
    "BPO Action Date": f.bpoActionDate,
    "Reappear Date": f.reappearDate,
    "Solved": f.solved ? "Yes" : "No",
    "Vendor Location": f.vendorLocation
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Management Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, `management_report_${Date.now()}.xlsx`);
};
export const exportPDF = (filteredForms = []) => {
 

  const doc = new jsPDF("l");

  const columns = [
    "Date & Time","Shop Name","Vendor Name","Contact Number","Email",
    "Executive","Team Lead","Area","State","Door Number","Street","PIN Code",
    "Status","Tag","Review","Executive Review","Vendor Review",
    "Assigned BPO","BPO Action Date","Reappear Date","Solved","Vendor Location"
  ];

  const rows = filteredForms.map(f => [
    f.createdAt,
    f.vendorShopName,
    f.vendorName,
    f.contactNumber,
    f.mailId,
    f.executiveName,
    f.teamleadName,
    f.areaName,
    f.state,
    f.doorNumber,
    f.streetName,
    f.pinCode,
    f.status,
    f.tag,
    f.review,
    f.executiveReview,
    f.vendorReview,
    f.assignedBpoId,
    f.bpoActionDate,
    f.reappearDate,
    f.solved ? "Yes" : "No",
    f.vendorLocation
  ]);

  doc.text("Management Dashboard Report", 14, 10);

  autoTable(doc, {
    head: [columns],
    body: rows,
    styles: { fontSize: 7 },
  });

  doc.save(`management_report_${Date.now()}.pdf`);
};