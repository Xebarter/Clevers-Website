"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "./ApplicationFormProvider";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ApplicationSubmitted = () => {
  const { getValues } = useFormContext<ApplicationFormValues>();
  const values = getValues();

  // Generate beautiful PDF function
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;

      // Bright colorful header
      doc.setFillColor(63, 81, 181); // Vibrant blue
      doc.rect(0, 0, pageWidth, 20, 'F');

      // School name in header
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255); // White text
      doc.setFont("helvetica", "bold");
      doc.text("Clevers' Origin Schools", margin, 15);

      // Add school logo - moved below the header and adjusted y position
      const logoUrl = '/logo.png';
      doc.addImage(logoUrl, 'PNG', pageWidth - 40, 25, 25, 25);

      // Main title with colorful underline
      doc.setFontSize(20);
      doc.setTextColor(63, 81, 181); // Vibrant blue
      doc.text("APPLICATION FORM", pageWidth / 2, 40, { align: 'center' });
      doc.setDrawColor(255, 152, 0); // Orange underline
      doc.setLineWidth(1.5);
      doc.line(pageWidth / 2 - 50, 43, pageWidth / 2 + 50, 43);

      // Section styling function with bright colors
      const addSection = (title: string, yPos: number, color: number[]) => {
        doc.setFontSize(12);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont("helvetica", "bold");
        doc.text(title.toUpperCase(), margin, yPos);
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
        return yPos + 8;
      };

      // Color palette for sections
      const colors = [
        [33, 150, 243], // Bright blue
        [76, 175, 80],   // Green
        [156, 39, 176], // Purple
        [255, 152, 0],   // Orange
        [233, 30, 99]    // Pink
      ];

      // Student Information (blue)
      let yPos = addSection("Student Information", 70, colors[0]);
      autoTable(doc, {
        startY: yPos,
        head: [['Field', 'Value']],
        headStyles: {
          fillColor: colors[0],
          textColor: 255,
          fontStyle: 'bold'
        },
        body: [
          ['Full Name', `${values.student.firstName} ${values.student.lastName}`],
          ['Date of Birth', values.student.dateOfBirth],
          ['Gender', values.student.gender],
          ['Nationality', values.student.nationality],
          ['Religion', values.student.religion || 'N/A'],
        ],
        theme: 'grid',
        styles: {
          cellPadding: 5,
          fontSize: 10,
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Guardian Information (green)
      yPos = (doc as any).lastAutoTable.finalY + 15;
      yPos = addSection("Guardian Information", yPos, colors[1]);
      autoTable(doc, {
        startY: yPos,
        head: [['Field', 'Value']],
        headStyles: {
          fillColor: colors[1],
          textColor: 255,
          fontStyle: 'bold'
        },
        body: [
          ['Full Name', `${values.guardian.firstName} ${values.guardian.lastName}`],
          ['Relationship', values.guardian.relationship],
          ['Email', values.guardian.email],
          ['Phone', values.guardian.phone],
          ['Occupation', values.guardian.occupation || 'N/A'],
          ['Address', values.guardian.address],
        ],
        theme: 'grid',
        styles: {
          cellPadding: 5,
          fontSize: 10,
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Campus Preference (purple)
      yPos = (doc as any).lastAutoTable.finalY + 15;
      yPos = addSection("Campus Preference", yPos, colors[2]);
      autoTable(doc, {
        startY: yPos,
        head: [['Field', 'Value']],
        headStyles: {
          fillColor: colors[2],
          textColor: 255,
          fontStyle: 'bold'
        },
        body: [
          ['Campus', values.campusPreference.campus],
          ['Admission Term', values.campusPreference.admissionTerm],
          ['Residential Option', values.campusPreference.residentialOption],
        ],
        theme: 'grid',
        styles: {
          cellPadding: 5,
          fontSize: 10,
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Additional Information (orange)
      yPos = (doc as any).lastAutoTable.finalY + 15;
      yPos = addSection("Additional Information", yPos, colors[3]);
      const additionalInfoBody = [];

      if (values.additional.specialNeeds) {
        additionalInfoBody.push(['Special Needs', values.additional.specialNeedsDetails || 'Details not provided']);
      }
      if (values.additional.healthConditions) {
        additionalInfoBody.push(['Health Conditions', values.additional.healthConditionsDetails || 'Details not provided']);
      }
      if (values.additional.howDidYouHear) {
        additionalInfoBody.push(['How You Heard About Us', values.additional.howDidYouHear]);
      }
      if (values.additional.additionalComments) {
        additionalInfoBody.push(['Additional Comments', values.additional.additionalComments]);
      }

      if (additionalInfoBody.length > 0) {
        autoTable(doc, {
          startY: yPos,
          head: [['Field', 'Value']],
          headStyles: {
            fillColor: colors[3],
            textColor: 255,
            fontStyle: 'bold'
          },
          body: additionalInfoBody,
          theme: 'grid',
          styles: {
            cellPadding: 5,
            fontSize: 10,
            valign: 'middle'
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          }
        });
      }

      // Colorful footer
      doc.setFillColor(63, 81, 181); // Vibrant blue
      doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 20, 'F');

      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("This document is computer generated and requires no signature.",
        pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });
      doc.text(`Generated on ${new Date().toLocaleString()}`,
        pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

      // Save the PDF with student name
      const fileName = `CleversOrigin_Application_${values.student.lastName}_${new Date().getFullYear()}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-4">Application Submitted Successfully!</h2>

      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for applying to Clevers' Origin Schools. We have received your application and will be in touch soon.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto text-left">
        <h3 className="font-bold text-lg mb-4">Application Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Applicant Name:</span>
            <span className="font-medium">{values.student.firstName} {values.student.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Campus:</span>
            <span className="font-medium capitalize">{values.campusPreference.campus} Campus</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Submission Date:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <Button
          variant="outline"
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
          onClick={generatePDF}
        >
          <Download className="h-4 w-4" />
          Download Application (PDF)
        </Button>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <p className="text-gray-500 mb-6">
          What happens next? Our admissions team will review your application and contact you within 1-2 business days.
        </p>

        <Link href="/">
          <Button className="gap-2">
            Return to Homepage
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ApplicationSubmitted;