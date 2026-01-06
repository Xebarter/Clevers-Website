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
  let cursorY = 60;

  /* =====================================================
     COLOR SYSTEM (Bright but Trustworthy)
  ===================================================== */
  const COLORS = {
    primary: [14, 165, 233], // sky-500
    accent: [236, 72, 153],  // pink-500
    success: [34, 197, 94],  // green-500
    textDark: [15, 23, 42],  // slate-900
    textMuted: [100, 116, 139], // slate-500
    borderSoft: [226, 232, 240], // slate-200
    rowAlt: [248, 250, 252], // slate-50
  };

  /* =====================================================
     HEADER
  ===================================================== */
  const drawHeader = () => {
    // Top bright band
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 38, "F");

    // Accent underline
    doc.setFillColor(...COLORS.accent);
    doc.rect(0, 38, pageWidth, 4, "F");

    // Logo
    try {
      doc.addImage("/budge.png", "PNG", marginX, 9, 22, 22);
    } catch {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("CLEVER'S ORIGIN SCHOOLS", marginX, 22);
    }

    // School name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("CLEVER'S ORIGIN SCHOOLS", pageWidth / 2, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      "Student Admission Application Summary",
      pageWidth / 2,
      28,
      { align: "center" }
    );
  };

  drawHeader();

  /* =====================================================
     SECTION TITLE
  ===================================================== */
  const sectionTitle = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COLORS.textDark);
    doc.text(title, marginX, cursorY);

    cursorY += 4;

    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.8);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);

    cursorY += 6;
  };

  /* =====================================================
     TABLE BASE STYLE
  ===================================================== */
  const baseTable = {
    theme: "grid" as const,
    styles: {
      fontSize: 10,
      cellPadding: 5,
      textColor: COLORS.textDark,
      lineColor: COLORS.borderSoft,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: COLORS.rowAlt,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        textColor: COLORS.textDark,
        cellWidth: 60,
      },
    },
    margin: { left: marginX, right: marginX },
  };

  /* =====================================================
     APPLICATION DETAILS
  ===================================================== */
  sectionTitle("Application Details");

  autoTable(doc, {
    startY: cursorY,
    ...baseTable,
    body: [
      ["Application ID", data.id],
      ["Submission Date", new Date(data.created_at).toLocaleDateString()],
      ["Payment Status", data.payment_status],
      ["Application Status", data.application_status],
    ],
  });

  cursorY = (doc as any).lastAutoTable.finalY + 10;

  /* =====================================================
     STUDENT INFORMATION
  ===================================================== */
  sectionTitle("Student Information");

  autoTable(doc, {
    startY: cursorY,
    ...baseTable,
    body: [
      ["Full Name", data.student_name],
      ["Date of Birth", data.date_of_birth],
      ["Gender", data.gender],
      ["Grade Applied For", data.grade_level],
    ],
  });

  cursorY = (doc as any).lastAutoTable.finalY + 10;

  /* =====================================================
     PARENT / GUARDIAN INFORMATION
  ===================================================== */
  sectionTitle("Parent / Guardian Information");

  autoTable(doc, {
    startY: cursorY,
    ...baseTable,
    body: [
      ["Full Name", data.parent_name],
      ["Relationship", data.relationship],
      ["Phone Number", data.phone],
      ["Email Address", data.email],
    ],
  });

  cursorY = (doc as any).lastAutoTable.finalY + 10;

  /* =====================================================
     CAMPUS & PREFERENCES
  ===================================================== */
  sectionTitle("Campus & Preferences");

  autoTable(doc, {
    startY: cursorY,
    ...baseTable,
    body: [
      ["Preferred Campus", data.campus],
      ["Boarding Option", data.boarding],
      ["Previous School", data.previous_school || "Not Provided"],
      ["Special Needs", data.special_needs || "None Declared"],
      ["How You Heard About Us", data.how_heard],
    ],
  });

  /* =====================================================
     FOOTER
  ===================================================== */
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(...COLORS.borderSoft);
    doc.line(marginX, pageHeight - 22, pageWidth - marginX, pageHeight - 22);

    doc.setFontSize(9);
    doc.setTextColor(...COLORS.textMuted);

    doc.text(
      "Clevers' Origin Schools | Excellence in Education",
      marginX,
      pageHeight - 14
    );

    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      pageWidth - marginX,
      pageHeight - 14,
      { align: "right" }
    );

    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  /* =====================================================
     SAVE
  ===================================================== */
  doc.save(`Application_${data.student_name.replace(/\s+/g, "_")}.pdf`);
}
