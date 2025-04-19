"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Download, ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "./ApplicationFormProvider";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ApplicationSubmitted = () => {
  const { getValues } = useFormContext<ApplicationFormValues>();
  const values = getValues();

  // Generate PDF function
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Clevers' Origin Schools Application", 105, 20, { align: 'center' });
    
    // Add application details
    doc.setFontSize(12);
    doc.text(`Application ID: APP-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`, 14, 30);
    doc.text(`Submission Date: ${new Date().toLocaleDateString()}`, 14, 40);
    
    // Student Information
    doc.setFontSize(14);
    doc.text("Student Information", 14, 50);
    autoTable(doc, {
      startY: 55,
      head: [['Field', 'Value']],
      body: [
        ['Full Name', `${values.student.firstName} ${values.student.lastName}`],
        ['Date of Birth', values.student.dateOfBirth],
        ['Gender', values.student.gender],
        ['Nationality', values.student.nationality],
        ['Religion', values.student.religion || 'N/A'],
      ],
    });

    // Guardian Information
    doc.setFontSize(14);
    doc.text("Guardian Information", 14, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Field', 'Value']],
      body: [
        ['Full Name', `${values.guardian.firstName} ${values.guardian.lastName}`],
        ['Relationship', values.guardian.relationship],
        ['Email', values.guardian.email],
        ['Phone', values.guardian.phone],
        ['Address', values.guardian.address],
      ],
    });

    // Campus Preference
    doc.setFontSize(14);
    doc.text("Campus Preference", 14, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Field', 'Value']],
      body: [
        ['Campus', values.campusPreference.campus],
        ['Admission Term', values.campusPreference.admissionTerm],
        ['Residential Option', values.campusPreference.residentialOption],
      ],
    });

    // Save the PDF
    doc.save(`CleversOrigin_Application_${values.student.lastName}.pdf`);
  };

  return (
    <div className="text-center py-8">
      {/* ... existing code ... */}

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={generatePDF}
        >
          <Download className="h-4 w-4" />
          Download Application (PDF)
        </Button>

        {/* ... rest of your existing code ... */}
      </div>

      {/* ... rest of your existing code ... */}
    </div>
  );
};

export default ApplicationSubmitted;