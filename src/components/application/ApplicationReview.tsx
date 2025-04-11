"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import type { ApplicationFormValues } from "./ApplicationFormProvider";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationForm } from "./ApplicationFormProvider";
import {
  User, Users, School, BookOpen, FileText,
  CreditCard, Pencil, Check, Star
} from "lucide-react";

const ApplicationReview = () => {
  const { control, getValues } = useFormContext<ApplicationFormValues>();
  const { goToStep } = useApplicationForm();
  const values = getValues();

  // Helper function to capitalize first letter
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Helper function to map enum values to user-friendly text
  const getReadableValue = (section: string, key: string, value: string) => {
    if (section === "campusPreference") {
      if (key === "campus") {
        const campusMap: Record<string, string> = {
          kitintale: "Kitintale Campus",
          kasokoso: "Kasokoso Campus",
          maganjo: "Maganjo Campus",
        };
        return campusMap[value] || value;
      }
      if (key === "admissionTerm") {
        const termMap: Record<string, string> = {
          term1: "Term 1 (January-April)",
          term2: "Term 2 (May-August)",
          term3: "Term 3 (September-December)",
        };
        return termMap[value] || value;
      }
      if (key === "residentialOption") {
        const residentialMap: Record<string, string> = {
          day: "Day Scholar",
          boarding: "Boarding Student",
        };
        return residentialMap[value] || value;
      }
    }

    if (section === "payment" && key === "method") {
      const methodMap: Record<string, string> = {
        mobile: "Mobile Money",
        card: "Credit/Debit Card",
        bank: "Bank Transfer",
      };
      return methodMap[value] || value;
    }

    return value;
  };

  // Format payment date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Map sections to icons and colors
  const sectionInfo = {
    student: { icon: User, color: "kinder-blue", title: "Student Information" },
    guardian: { icon: Users, color: "kinder-purple", title: "Parent/Guardian Information" },
    academic: { icon: BookOpen, color: "kinder-green", title: "Academic Information" },
    campus: { icon: School, color: "kinder-red", title: "Campus Preference" },
    additional: { icon: FileText, color: "kinder-orange", title: "Additional Information" },
    payment: { icon: CreditCard, color: "kinder-yellow", title: "Payment Information" },
  };

  // Function to render a review section
  const renderSection = (title: string, data: any, section: string) => {
    if (!data) return null;

    const sectionData = sectionInfo[section as keyof typeof sectionInfo];
    const SectionIcon = sectionData?.icon || Star;
    const sectionColor = sectionData?.color || "kinder-blue";

    return (
      <Card className={`mb-6 rounded-xl overflow-hidden border-2 border-${sectionColor}/30 shadow-md`}>
        <CardHeader className={`pb-3 bg-${sectionColor}/10 flex flex-row justify-between items-center`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full bg-${sectionColor}/20`}>
              <SectionIcon className={`h-5 w-5 text-${sectionColor}`} />
            </div>
            <CardTitle className={`text-lg font-heading text-${sectionColor}`}>{title}</CardTitle>
          </div>
          <button
            type="button"
            onClick={() => goToStep(section as any)}
            className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-body bg-white/80 px-3 py-1 rounded-full shadow-sm border border-blue-100"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 pt-4">
          {Object.entries(data).map(([key, value]) => {
            // Skip rendering some fields based on logic
            if (
              (key === "specialNeedsDetails" && !data.specialNeeds) ||
              (key === "healthConditionsDetails" && !data.healthConditions) ||
              (key === "status" && section === "payment") || // Skip status field for payment
              (key === "paymentComplete" && section === "payment") // Skip paymentComplete field
            ) {
              return null;
            }

            // Format display of boolean values
            if (typeof value === "boolean") {
              return (
                <div key={key} className="flex items-center bg-gray-50 p-2 rounded-lg">
                  <span className="font-medium text-gray-700 font-heading">{key.split(/(?=[A-Z])/).map(capitalize).join(" ")}:</span>{" "}
                  <span className="ml-2 font-body flex items-center">
                    {value ?
                      <Check className="h-4 w-4 text-kinder-green mr-1" /> :
                      "No"
                    }
                    {value && key !== "termsAccepted" && "Yes"}
                  </span>
                </div>
              );
            }

            // Skip empty values
            if (value === "" || value === undefined) return null;

            // Format transaction date
            if (key === "transactionDate" && section === "payment") {
              return (
                <div key={key} className="flex items-center bg-gray-50 p-2 rounded-lg">
                  <span className="font-medium text-gray-700 font-heading">Date:</span>{" "}
                  <span className="ml-2 font-body">{formatDate(value as string)}</span>
                </div>
              );
            }

            return (
              <div key={key} className="flex items-start bg-gray-50 p-2 rounded-lg">
                <span className="font-medium text-gray-700 font-heading">{key.split(/(?=[A-Z])/).map(capitalize).join(" ")}:</span>{" "}
                <span className="ml-2 font-body">{getReadableValue(section, key, value as string)}</span>
              </div>
            );
          })}

          {/* Add fee amount for payment section */}
          {section === "payment" && (
            <div className="flex items-center bg-gray-50 p-2 rounded-lg">
              <span className="font-medium text-gray-700 font-heading">Amount:</span>{" "}
              <span className="ml-2 font-bold text-kinder-green font-body">UGX 50,000</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="pb-4">
      <h2 className="text-2xl font-bold mb-4 font-heading text-kinder-blue flex items-center">
        <Check className="mr-2 text-kinder-green bg-kinder-green/20 p-1 rounded-full h-8 w-8" />
        Review Your Application
      </h2>
      <p className="text-gray-600 mb-8 font-body bg-kinder-yellow/10 p-4 rounded-xl border border-kinder-yellow/30">
        Please review all the information you have provided before submitting your application. Check that everything is correct!
      </p>

      {renderSection(sectionInfo.student.title, values.student, "student")}
      {renderSection(sectionInfo.guardian.title, values.guardian, "guardian")}
      {renderSection(sectionInfo.academic.title, values.academic, "academic")}
      {renderSection(sectionInfo.campus.title, values.campusPreference, "campus")}
      {renderSection(sectionInfo.additional.title, values.additional, "additional")}
      {renderSection(sectionInfo.payment.title, values.payment, "payment")}

      <div className="mt-8 border-t-2 border-kinder-yellow/30 pt-6">
        <FormField
          control={control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-xl border-2 border-kinder-blue/30 p-5 bg-kinder-blue/5">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="kinder-checkbox h-6 w-6 mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-heading text-lg text-kinder-blue">
                  Terms and Conditions
                </FormLabel>
                <p className="text-gray-600 font-body">
                  I confirm that the information provided is accurate and complete. I understand that providing false information may result in the cancellation of the application or admission. I agree to abide by the rules and regulations of Clevers' Origin Schools.
                </p>
              </div>
            </FormItem>
          )}
        />
        <FormMessage className="mt-2 text-kinder-red font-heading" />
      </div>
    </div>
  );
};

export default ApplicationReview;
