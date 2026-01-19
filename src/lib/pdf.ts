import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ApplicationData {
  id: string;
  student_name: string;
  date_of_birth: string;
  gender: string;
  grade_level: string;
  parent_name: string;
  relationship: string;
  phone: string;
  email: string;
  campus: string;
  boarding: string;
  previous_school?: string;
  special_needs?: string;
  how_heard: string;
  payment_status: string;
  application_status: string;
  created_at: string;
}

export function generateApplicationPDF(data: ApplicationData) {
  const doc = new jsPDF({ format: "a4", unit: "mm" });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const marginX = 20;
  let cursorY = 45;

  /* =====================================================
      COLOR SYSTEM (Vibrant & Trustworthy)
  ===================================================== */
  const COLORS = {
    primary: [14, 165, 233],    // Sky Blue (Friendly)
    secondary: [30, 41, 59],    // Slate 800 (Professional)
    accent: [244, 63, 94],      // Rose (Fun)
    success: [34, 197, 94],     // Green
    warning: [245, 158, 11],    // Amber
    textDark: [15, 23, 42],     // Slate 900
    textMuted: [100, 116, 139],  // Slate 500
    bgLight: [248, 250, 252],   // Slate 50
    borderSoft: [226, 232, 240], // Slate 200
  };

  /* =====================================================
      HELPER: DRAW BADGE
  ===================================================== */
  const drawBadge = (text: string, x: number, y: number, type: 'success' | 'warning' | 'primary') => {
    const color = type === 'success' ? COLORS.success : type === 'warning' ? COLORS.warning : COLORS.primary;
    const padding = 2;
    const txtWidth = doc.getTextWidth(text);

    // Draw rounded rect (manually)
    doc.setFillColor(...color);
    doc.roundedRect(x, y - 4, txtWidth + (padding * 4), 6, 2, 2, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(text.toUpperCase(), x + (padding * 2), y);
  };

  /* =====================================================
      HEADER DESIGN
  ===================================================== */
  const drawHeader = () => {
    // Left decorative bar
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, 5, 40, "F");

    // Logo Placeholder / Image
    try {
      doc.addImage("/logo.png", "PNG", marginX, 10, 20, 20);
    } catch {
      // Fallback Circle for Logo
      doc.setFillColor(...COLORS.primary);
      doc.circle(marginX + 10, 20, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text("C", marginX + 8.5, 21.5);
    }

    // School Info
    doc.setDrawColor(...COLORS.borderSoft);
    doc.setTextColor(...COLORS.textDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CLEVER'S ORIGIN SCHOOLS", marginX + 25, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.textMuted);
    doc.text("123 Education Lane, Learning City | info@cleversorigin.com", marginX + 25, 24);

    // Right Side Document Label
    doc.setFillColor(...COLORS.bgLight);
    doc.roundedRect(pageWidth - 75, 10, 55, 20, 2, 2, "F");
    doc.setTextColor(...COLORS.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("OFFICIAL ADMISSION", pageWidth - 70, 18);
    doc.setTextColor(...COLORS.textMuted);
    doc.setFontSize(8);
    doc.text(`ID: ${data.id}`, pageWidth - 70, 24);
  };

  drawHeader();

  /* =====================================================
      SECTION HEADER HELPER
  ===================================================== */
  const drawSectionHeader = (title: string, y: number) => {
    // Soft background for section
    doc.setFillColor(...COLORS.bgLight);
    doc.roundedRect(marginX, y - 6, pageWidth - (marginX * 2), 8, 1, 1, "F");

    // Vertical accent
    doc.setFillColor(...COLORS.accent);
    doc.rect(marginX, y - 6, 1.5, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.secondary);
    doc.text(title, marginX + 5, y);

    return y + 6;
  };

  /* =====================================================
      1. APPLICATION SUMMARY (Status Badges)
  ===================================================== */
  cursorY = drawSectionHeader("Application Overview", cursorY);

  autoTable(doc, {
    startY: cursorY,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold', textColor: COLORS.textMuted } },
    body: [
      ["Submission Date", new Date(data.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
      ["Payment Status", data.payment_status],
      ["Application Status", data.application_status],
    ],
    didDrawCell: (dataCell) => {
      // Custom draw badges for specific values
      if (dataCell.column.index === 1 && dataCell.section === 'body') {
        if (dataCell.cell.text[0] === 'Paid' || dataCell.cell.text[0] === 'Approved') {
          drawBadge(dataCell.cell.text[0], dataCell.cell.x + 2, dataCell.cell.y + 5, 'success');
          dataCell.cell.text = [""]; // Clear original text
        }
      }
    }
  });

  cursorY = (doc as any).lastAutoTable.finalY + 12;

  /* =====================================================
      2. STUDENT & PARENT INFO (Side-by-Side look)
  ===================================================== */
  cursorY = drawSectionHeader("Student Information", cursorY);

  autoTable(doc, {
    startY: cursorY,
    theme: "striped",
    head: [['Field', 'Details']],
    headStyles: { fillColor: COLORS.primary, fontSize: 9 },
    alternateRowStyles: { fillColor: COLORS.bgLight },
    styles: { lineColor: COLORS.borderSoft, lineWidth: 0.1 },
    body: [
      ["Full Name", data.student_name],
      ["Date of Birth", data.date_of_birth],
      ["Gender", data.gender],
      ["Grade Level", data.grade_level],
    ],
  });

  cursorY = (doc as any).lastAutoTable.finalY + 12;

  cursorY = drawSectionHeader("Parent / Guardian Contact", cursorY);

  autoTable(doc, {
    startY: cursorY,
    theme: "grid",
    styles: { lineColor: COLORS.borderSoft, lineWidth: 0.1, fontSize: 10 },
    columnStyles: { 0: { fillColor: [250, 250, 250], fontStyle: 'bold', cellWidth: 45 } },
    body: [
      ["Guardian Name", data.parent_name],
      ["Relationship", data.relationship],
      ["Contact Number", data.phone],
      ["Email Address", data.email],
    ],
  });

  cursorY = (doc as any).lastAutoTable.finalY + 12;

  /* =====================================================
      3. PREFERENCES & ENROLLMENT
  ===================================================== */
  cursorY = drawSectionHeader("Enrollment Preferences", cursorY);

  autoTable(doc, {
    startY: cursorY,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 4 },
    body: [
      ["Preferred Campus", data.campus, "Boarding", data.boarding],
      ["Previous School", data.previous_school || "N/A", "Special Needs", data.special_needs || "None"],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', textColor: COLORS.textMuted, cellWidth: 35 },
      2: { fontStyle: 'bold', textColor: COLORS.textMuted, cellWidth: 35 }
    },
  });

  /* =====================================================
      FOOTER
  ===================================================== */
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Bottom Bar
    doc.setFillColor(...COLORS.secondary);
    doc.rect(0, pageHeight - 15, pageWidth, 15, "F");

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "This is an electronically generated document. No signature is required for the initial summary.",
      marginX,
      pageHeight - 8
    );

    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - marginX - 15,
      pageHeight - 8
    );

    // Tiny Brand Accent
    doc.setFillColor(...COLORS.accent);
    doc.rect(pageWidth - marginX, pageHeight - 15, 20, 15, "F");
  }

  /* =====================================================
      SAVE
  ===================================================== */
  doc.save(`Application_${data.student_name.replace(/\s+/g, "_")}.pdf`);
}

/* =====================================================
    JOB APPLICATION PDF GENERATOR
===================================================== */

export interface JobApplicationData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  position_applied: string;
  experience_years: number;
  qualifications: string;
  skills?: string;
  cover_letter?: string;
  references_info?: string;
  cv_url?: string;
  certificates_url?: string;
  other_documents_url?: string;
  application_status: string;
  created_at: string;
}

export function generateJobApplicationPDF(data: JobApplicationData) {
  const doc = new jsPDF({ format: "a4", unit: "mm" });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const marginX = 20;
  let cursorY = 45;

  /* =====================================================
      COLOR SYSTEM
  ===================================================== */
  const COLORS = {
    primary: [236, 72, 153],    // Pink 500 (matching site theme)
    secondary: [30, 41, 59],    // Slate 800
    accent: [234, 179, 8],      // Yellow 500
    success: [34, 197, 94],     // Green
    warning: [245, 158, 11],    // Amber
    textDark: [15, 23, 42],     // Slate 900
    textMuted: [100, 116, 139], // Slate 500
    bgLight: [248, 250, 252],   // Slate 50
    borderSoft: [226, 232, 240], // Slate 200
  };

  /* =====================================================
      HELPER: DRAW BADGE
  ===================================================== */
  const drawBadge = (text: string, x: number, y: number, type: 'success' | 'warning' | 'primary' | 'pending') => {
    const colorMap = {
      success: COLORS.success,
      warning: COLORS.warning,
      primary: COLORS.primary,
      pending: COLORS.textMuted
    };
    const color = colorMap[type] || COLORS.primary;
    const padding = 2;
    const txtWidth = doc.getTextWidth(text);

    doc.setFillColor(...(color as [number, number, number]));
    doc.roundedRect(x, y - 4, txtWidth + (padding * 4), 6, 2, 2, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(text.toUpperCase(), x + (padding * 2), y);
  };

  /* =====================================================
      HEADER DESIGN
  ===================================================== */
  const drawHeader = () => {
    // Left decorative bar
    doc.setFillColor(...(COLORS.primary as [number, number, number]));
    doc.rect(0, 0, 5, 40, "F");

    // Logo Placeholder
    try {
      doc.addImage("/logo.png", "PNG", marginX, 10, 20, 20);
    } catch {
      doc.setFillColor(...(COLORS.primary as [number, number, number]));
      doc.circle(marginX + 10, 20, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text("C", marginX + 8.5, 21.5);
    }

    // School Info
    doc.setDrawColor(...(COLORS.borderSoft as [number, number, number]));
    doc.setTextColor(...(COLORS.textDark as [number, number, number]));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CLEVER'S ORIGIN SCHOOLS", marginX + 25, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...(COLORS.textMuted as [number, number, number]));
    doc.text("Careers Department | careers@cleversorigin.com", marginX + 25, 24);

    // Right Side Document Label
    doc.setFillColor(...(COLORS.bgLight as [number, number, number]));
    doc.roundedRect(pageWidth - 75, 10, 55, 20, 2, 2, "F");
    doc.setTextColor(...(COLORS.primary as [number, number, number]));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("JOB APPLICATION", pageWidth - 70, 18);
    doc.setTextColor(...(COLORS.textMuted as [number, number, number]));
    doc.setFontSize(8);
    doc.text(`ID: ${data.id.substring(0, 8)}...`, pageWidth - 70, 24);
  };

  drawHeader();

  /* =====================================================
      SECTION HEADER HELPER
  ===================================================== */
  const drawSectionHeader = (title: string, y: number) => {
    doc.setFillColor(...(COLORS.bgLight as [number, number, number]));
    doc.roundedRect(marginX, y - 6, pageWidth - (marginX * 2), 8, 1, 1, "F");

    doc.setFillColor(...(COLORS.accent as [number, number, number]));
    doc.rect(marginX, y - 6, 1.5, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...(COLORS.secondary as [number, number, number]));
    doc.text(title, marginX + 5, y);

    return y + 6;
  };

  /* =====================================================
      1. APPLICATION OVERVIEW
  ===================================================== */
  cursorY = drawSectionHeader("Application Overview", cursorY);

  const getStatusType = (status: string): 'success' | 'warning' | 'pending' | 'primary' => {
    switch (status.toLowerCase()) {
      case 'hired':
      case 'approved':
        return 'success';
      case 'reviewing':
      case 'shortlisted':
      case 'interviewed':
        return 'warning';
      case 'pending':
        return 'pending';
      default:
        return 'primary';
    }
  };

  autoTable(doc, {
    startY: cursorY,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { cellWidth: 45, fontStyle: 'bold', textColor: COLORS.textMuted as [number, number, number] } },
    body: [
      ["Submission Date", new Date(data.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
      ["Position Applied", data.position_applied],
      ["Application Status", data.application_status],
    ],
    didDrawCell: (dataCell) => {
      if (dataCell.column.index === 1 && dataCell.section === 'body' && dataCell.row.index === 2) {
        const status = dataCell.cell.text[0];
        drawBadge(status, dataCell.cell.x + 2, dataCell.cell.y + 5, getStatusType(status));
        dataCell.cell.text = [""];
      }
    }
  });

  cursorY = (doc as any).lastAutoTable.finalY + 12;

  /* =====================================================
      2. PERSONAL INFORMATION
  ===================================================== */
  cursorY = drawSectionHeader("Personal Information", cursorY);

  autoTable(doc, {
    startY: cursorY,
    theme: "striped",
    head: [['Field', 'Details']],
    headStyles: { fillColor: COLORS.primary as [number, number, number], fontSize: 9 },
    alternateRowStyles: { fillColor: COLORS.bgLight as [number, number, number] },
    styles: { lineColor: COLORS.borderSoft as [number, number, number], lineWidth: 0.1 },
    body: [
      ["Full Name", data.full_name],
      ["Email Address", data.email],
      ["Phone Number", data.phone],
      ["Address", data.address || "N/A"],
    ],
  });

  cursorY = (doc as any).lastAutoTable.finalY + 12;

  /* =====================================================
      3. PROFESSIONAL INFORMATION
  ===================================================== */
  cursorY = drawSectionHeader("Professional Information", cursorY);

  const experienceText = data.experience_years === 0 ? "Fresh Graduate" : 
    data.experience_years === 1 ? "1-2 Years" :
    data.experience_years <= 5 ? "3-5 Years" :
    data.experience_years <= 10 ? "5-10 Years" : "10+ Years";

  autoTable(doc, {
    startY: cursorY,
    theme: "grid",
    styles: { lineColor: COLORS.borderSoft as [number, number, number], lineWidth: 0.1, fontSize: 10 },
    columnStyles: { 0: { fillColor: [250, 250, 250], fontStyle: 'bold', cellWidth: 45 } },
    body: [
      ["Position Applied", data.position_applied],
      ["Experience", experienceText],
      ["Education Level", data.qualifications],
      ["Skills", data.skills || "N/A"],
    ],
  });

  cursorY = (doc as any).lastAutoTable.finalY + 12;

  /* =====================================================
      4. COVER LETTER (if provided)
  ===================================================== */
  if (data.cover_letter) {
    cursorY = drawSectionHeader("Cover Letter", cursorY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...(COLORS.textDark as [number, number, number]));
    
    const splitText = doc.splitTextToSize(data.cover_letter, pageWidth - (marginX * 2) - 10);
    
    // Check if we need a new page
    if (cursorY + (splitText.length * 5) > pageHeight - 30) {
      doc.addPage();
      cursorY = 20;
    }
    
    doc.text(splitText, marginX + 5, cursorY + 2);
    cursorY += (splitText.length * 5) + 12;
  }

  /* =====================================================
      5. REFERENCES (if provided)
  ===================================================== */
  if (data.references_info) {
    // Check if we need a new page
    if (cursorY > pageHeight - 60) {
      doc.addPage();
      cursorY = 20;
    }

    cursorY = drawSectionHeader("Professional References", cursorY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...(COLORS.textDark as [number, number, number]));
    
    const splitText = doc.splitTextToSize(data.references_info, pageWidth - (marginX * 2) - 10);
    doc.text(splitText, marginX + 5, cursorY + 2);
    cursorY += (splitText.length * 5) + 12;
  }

  /* =====================================================
      6. ATTACHED DOCUMENTS
  ===================================================== */
  if (data.cv_url || data.certificates_url || data.other_documents_url) {
    // Check if we need a new page
    if (cursorY > pageHeight - 50) {
      doc.addPage();
      cursorY = 20;
    }

    cursorY = drawSectionHeader("Attached Documents", cursorY);

    const documents = [];
    if (data.cv_url) documents.push(["Resume/CV", "Attached"]);
    if (data.certificates_url) documents.push(["Certificates", "Attached"]);
    if (data.other_documents_url) documents.push(["Other Documents", "Attached"]);

    autoTable(doc, {
      startY: cursorY,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold', textColor: COLORS.textMuted as [number, number, number], cellWidth: 45 } },
      body: documents,
    });
  }

  /* =====================================================
      FOOTER
  ===================================================== */
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFillColor(...(COLORS.secondary as [number, number, number]));
    doc.rect(0, pageHeight - 15, pageWidth, 15, "F");

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "This is an electronically generated document from Clevers' Origin Schools Careers Portal.",
      marginX,
      pageHeight - 8
    );

    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - marginX - 15,
      pageHeight - 8
    );

    doc.setFillColor(...(COLORS.accent as [number, number, number]));
    doc.rect(pageWidth - marginX, pageHeight - 15, 20, 15, "F");
  }

  /* =====================================================
      SAVE
  ===================================================== */
  doc.save(`Job_Application_${data.full_name.replace(/\s+/g, "_")}.pdf`);
}