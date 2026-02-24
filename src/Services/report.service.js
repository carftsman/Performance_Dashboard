import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

class ReportService {
  // Filter data by date period
  filterDataByPeriod(data, period) {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    
    let startDate;
    switch(period) {
      case 'today':
        startDate = today;
        break;
      case '15days':
        startDate = new Date(now.setDate(now.getDate() - 15));
        break;
      case '1month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3months':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6months':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case 'annual':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return data;
    }

    return data.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= startDate;
    });
  }

  // Get period label
  getPeriodLabel(period) {
    const labels = {
      'today': 'Today',
      '15days': 'Last 15 Days',
      '1month': 'Last 1 Month',
      '3months': 'Last 3 Months',
      '6months': 'Last 6 Months',
      'annual': 'Annual (Last 12 Months)',
      'all': 'All Time'
    };
    return labels[period] || period;
  }

  // Format date for reports
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Format date only (without time)
  formatDateOnly(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Generate Excel report for any dashboard
  generateExcelReport(data, period, dashboardType = 'management') {
    if (!data || data.length === 0) {
      throw new Error("No data to export");
    }

    // Prepare main data sheet based on dashboard type
    const exportData = this.prepareExportData(data, dashboardType);

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Main data sheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Auto-size columns
    const colWidths = [];
    Object.keys(exportData[0] || {}).forEach(key => {
      colWidths.push({ wch: Math.min(key.length + 10, 50) });
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, `${dashboardType} Data`);

    // Add summary sheet
    const summaryData = this.prepareSummaryData(data, period, dashboardType);
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Generate filename and save
    const fileName = `Report For Selected TIme Period${period}_${new Date().toISOString().split('T')[0]}.xlsx`;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);

    return true;
  }

  // Prepare export data based on dashboard type
  prepareExportData(data, dashboardType) {
    switch(dashboardType) {
      case 'admin':
        return data.map(f => ({
          "Date & Time": this.formatDate(f.createdAt),
          "Shop Name": f.vendorShopName || 'N/A',
          "Vendor Name": f.vendorName || 'N/A',
          "Contact Number": f.contactNumber || 'N/A',
          "Email": f.mailId || 'N/A',
          "Executive": f.executiveName || f.executiveId || 'N/A',
          "Team Lead": f.teamleadName || f.teamleadId || 'N/A',
          "Area": f.areaName || 'N/A',
          "State": f.state || 'N/A',
          "Status": f.status || 'N/A',
          "Tag": f.tag || 'N/A',
          "Assigned BPO": f.assignedBpoName || f.assignedBpoId || 'Not Assigned',
          "BPO Action Date": f.bpoActionDate ? this.formatDate(f.bpoActionDate) : 'N/A',
          "Reappear Date": f.reappearDate ? this.formatDate(f.reappearDate) : 'N/A',
          "Solved": f.solved ? "Yes" : "No"
        }));

      case 'analyst':
        return data.map(f => ({
          "Date": this.formatDateOnly(f.createdAt),
          "Shop Name": f.vendorShopName || 'N/A',
          "Vendor Name": f.vendorName || 'N/A',
          "Contact": f.contactNumber || 'N/A',
          "Executive": f.executiveName || f.executiveId || 'N/A',
          "Team Lead": f.teamleadName || f.teamleadId || 'N/A',
          "Area": f.areaName || 'N/A',
          "State": f.state || 'N/A',
          "Status": f.status || 'N/A',
          "Tag": f.tag || 'N/A',
          "Review": f.review || 'N/A',
          "Executive Review": f.executiveReview || 'N/A',
          "Vendor Review": f.vendorReview || 'N/A',
          "Performance Score": this.calculatePerformanceScore(f) || 'N/A'
        }));

      default: // management
        return data.map(f => ({
          "Date & Time": this.formatDate(f.createdAt),
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
          "BPO Action Date": f.bpoActionDate ? this.formatDate(f.bpoActionDate) : 'N/A',
          "Reappear Date": f.reappearDate ? this.formatDate(f.reappearDate) : 'N/A',
          "Solved": f.solved ? "Yes" : "No",
          "Vendor Location": f.vendorLocation || 'N/A'
        }));
    }
  }

  // Calculate performance score for analyst dashboard
  calculatePerformanceScore(form) {
    let score = 0;
    if (form.status === 'ONBOARDED') score += 50;
    else if (form.status === 'INTERESTED') score += 30;
    else if (form.status === 'NOT_INTERESTED') score += 10;
    
    if (form.solved) score += 20;
    if (form.tag === 'GREEN') score += 15;
    else if (form.tag === 'ORANGE') score += 10;
    else if (form.tag === 'YELLOW') score += 5;
    
    return score;
  }

  // Prepare summary data
  prepareSummaryData(data, period, dashboardType) {
    const statusSummary = data.reduce((acc, form) => {
      const status = form.status || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const tagSummary = data.reduce((acc, form) => {
      const tag = form.tag || 'NO TAG';
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    const teamLeadSummary = data.reduce((acc, form) => {
      const tl = form.teamleadName || 'UNASSIGNED';
      acc[tl] = (acc[tl] || 0) + 1;
      return acc;
    }, {});

    const areaSummary = data.reduce((acc, form) => {
      const area = form.areaName || 'UNKNOWN';
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});

    const summaryData = [
      ['REPORT SUMMARY'],
      ['Generated On', new Date().toLocaleString()],
      ['Report Period', this.getPeriodLabel(period)],
      ['Dashboard Type', dashboardType.toUpperCase()],
      ['Total Records', data.length.toString()],
      [],
      ['STATUS BREAKDOWN'],
      ['Status', 'Count'],
      ...Object.entries(statusSummary),
      [],
      ['TAG BREAKDOWN'],
      ['Tag', 'Count'],
      ...Object.entries(tagSummary),
      [],
      ['TEAM LEAD BREAKDOWN'],
      ['Team Lead', 'Count'],
      ...Object.entries(teamLeadSummary),
      [],
      ['AREA BREAKDOWN'],
      ['Area', 'Count'],
      ...Object.entries(areaSummary)
    ];

    if (dashboardType === 'analyst') {
      const performanceStats = this.calculatePerformanceStats(data);
      summaryData.push(
        [],
        ['PERFORMANCE METRICS'],
        ['Metric', 'Value'],
        ['Average Performance Score', performanceStats.avgScore.toFixed(2)],
        ['Highest Score', performanceStats.maxScore],
        ['Lowest Score', performanceStats.minScore],
        ['Conversion Rate', `${performanceStats.conversionRate}%`]
      );
    }

    return summaryData;
  }

  // Calculate performance statistics for analyst dashboard
  calculatePerformanceStats(data) {
    const scores = data.map(f => this.calculatePerformanceScore(f));
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length || 0;
    const maxScore = Math.max(...scores) || 0;
    const minScore = Math.min(...scores) || 0;
    
    const onboardedCount = data.filter(f => f.status === 'ONBOARDED').length;
    const conversionRate = ((onboardedCount / data.length) * 100).toFixed(2);

    return { avgScore, maxScore, minScore, conversionRate };
  }

  // Generate PDF report
  generatePDFReport(data, period, dashboardType = 'management') {
    if (!data || data.length === 0) {
      throw new Error("No data to export");
    }

    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.text(`${dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1)} Dashboard Report`, pageWidth / 2, 15, { align: 'center' });

    // Metadata
    doc.setFontSize(10);
    doc.text(`Period: ${this.getPeriodLabel(period)}`, 14, 25);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Records: ${data.length}`, 14, 35);

    // Summary statistics
    let yPos = 45;
    doc.setFontSize(12);
    doc.text('Summary', 14, yPos);
    yPos += 7;

    // Status summary
    const statusSummary = data.reduce((acc, form) => {
      const status = form.status || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    doc.setFontSize(9);
    Object.entries(statusSummary).forEach(([status, count]) => {
      doc.text(`${status}: ${count}`, 20, yPos);
      yPos += 5;
    });

    if (dashboardType === 'analyst') {
      yPos += 2;
      const performanceStats = this.calculatePerformanceStats(data);
      doc.text(`Avg Performance Score: ${performanceStats.avgScore.toFixed(2)}`, 20, yPos);
      yPos += 5;
      doc.text(`Conversion Rate: ${performanceStats.conversionRate}%`, 20, yPos);
    }

    // Main table based on dashboard type
    const tableConfig = this.getTableConfig(dashboardType, data);
    
    autoTable(doc, {
      head: [tableConfig.columns],
      body: tableConfig.rows,
      startY: yPos + 15,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: yPos + 20 }
    });

    const fileName = `Report For Selected Time Period${period}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return true;
  }

  // Get table configuration based on dashboard type
  getTableConfig(dashboardType, data) {
    switch(dashboardType) {
      case 'admin':
        return {
          columns: ["Date", "Shop", "Vendor", "Contact", "Executive", "Team Lead", "Area", "Status", "Tag", "BPO"],
          rows: data.map(f => [
            this.formatDateOnly(f.createdAt),
            f.vendorShopName || 'N/A',
            f.vendorName || 'N/A',
            f.contactNumber || 'N/A',
            f.executiveName || f.executiveId || 'N/A',
            f.teamleadName || f.teamleadId || 'N/A',
            f.areaName || 'N/A',
            f.status || 'N/A',
            f.tag || 'N/A',
            f.assignedBpoName || f.assignedBpoId || 'N/A'
          ])
        };

      case 'analyst':
        return {
          columns: ["Date", "Shop", "Vendor", "Executive", "Area", "Status", "Tag", "Score"],
          rows: data.map(f => [
            this.formatDateOnly(f.createdAt),
            f.vendorShopName || 'N/A',
            f.vendorName || 'N/A',
            f.executiveName || f.executiveId || 'N/A',
            f.areaName || 'N/A',
            f.status || 'N/A',
            f.tag || 'N/A',
            this.calculatePerformanceScore(f).toString()
          ])
        };

      default: // management
        return {
          columns: ["Date", "Shop", "Vendor", "Contact", "Executive", "Team Lead", "Area", "Status", "Tag"],
          rows: data.map(f => [
            this.formatDateOnly(f.createdAt),
            f.vendorShopName || 'N/A',
            f.vendorName || 'N/A',
            f.contactNumber || 'N/A',
            f.executiveName || f.executiveId || 'N/A',
            f.teamleadName || f.teamleadId || 'N/A',
            f.areaName || 'N/A',
            f.status || 'N/A',
            f.tag || 'N/A'
          ])
        };
    }
  }
}

export const reportService = new ReportService();