import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

export function generateApplicationPDF(applicationData: ApplicationData) {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Student Application Form', 105, 20, { align: 'center' });

  // Add school logo or information if available
  doc.setFontSize(12);
  doc.text('Clevers School', 20, 30);

  // Add application details
  doc.setFontSize(14);
  doc.text('Application Details', 20, 45);

  // Add application information in a table format
  const applicationDetails = [
    ['Field', 'Value'],
    ['Application ID', applicationData.id],
    ['Submitted Date', new Date(applicationData.created_at).toLocaleDateString()],
    ['Payment Status', applicationData.payment_status],
    ['Application Status', applicationData.application_status],
  ];

  (doc as any).autoTable({
    startY: 50,
    head: [applicationDetails[0]],
    body: applicationDetails.slice(1),
    theme: 'grid',
    styles: { cellPadding: 5, fontSize: 10 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
  });

  // Add student information
  doc.setFontSize(14);
  doc.text('Student Information', 20, (doc as any).lastAutoTable.finalY + 10);

  const studentDetails = [
    ['Field', 'Value'],
    ['Full Name', applicationData.student_name],
    ['Date of Birth', applicationData.date_of_birth],
    ['Gender', applicationData.gender],
    ['Grade Level', applicationData.grade_level],
  ];

  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [studentDetails[0]],
    body: studentDetails.slice(1),
    theme: 'grid',
    styles: { cellPadding: 5, fontSize: 10 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
  });

  // Add parent/guardian information
  doc.setFontSize(14);
  doc.text('Parent/Guardian Information', 20, (doc as any).lastAutoTable.finalY + 10);

  const parentDetails = [
    ['Field', 'Value'],
    ['Full Name', applicationData.parent_name],
    ['Relationship', applicationData.relationship],
    ['Phone Number', applicationData.phone],
    ['Email Address', applicationData.email],
  ];

  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [parentDetails[0]],
    body: parentDetails.slice(1),
    theme: 'grid',
    styles: { cellPadding: 5, fontSize: 10 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
  });

  // Add campus and preference information
  doc.setFontSize(14);
  doc.text('Campus and Preference', 20, (doc as any).lastAutoTable.finalY + 10);

  const campusDetails = [
    ['Field', 'Value'],
    ['Preferred Campus', applicationData.campus],
    ['Boarding Preference', applicationData.boarding],
    ['Previous School', applicationData.previous_school || 'N/A'],
    ['Special Needs', applicationData.special_needs || 'N/A'],
    ['How Heard About Us', applicationData.how_heard],
  ];

  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [campusDetails[0]],
    body: campusDetails.slice(1),
    theme: 'grid',
    styles: { cellPadding: 5, fontSize: 10 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
  });

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
      align: 'center',
    });
  }

  // Save the PDF
  doc.save(`Application-${applicationData.id}.pdf`);
}