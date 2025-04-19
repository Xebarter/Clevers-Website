"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ApplicationFormProvider, { useApplicationForm } from "./ApplicationFormProvider";
import StudentInformationForm from "./StudentInformationForm";
import GuardianInformationForm from "./GuardianInformationForm";
import AcademicInformationForm from "./AcademicInformationForm";
import CampusPreferenceForm from "./CampusPreferenceForm";
import AdditionalInformationForm from "./AdditionalInformationForm";
import ApplicationReview from "./ApplicationReview";
import ApplicationSubmitted from "./ApplicationSubmitted";
import ApplicationFormProgress from "./ApplicationFormProgress";
import ApplicationFormNavigation from "./ApplicationFormNavigation";
import { Sparkles, InfoIcon } from "lucide-react";

// Map steps to their help text for contextual guidance
const stepHelpText = {
  student: "Please provide the student's personal information. All fields marked with * are required.",
  guardian: "Please provide the parent/guardian's contact information for communication purposes.",
  academic: "Tell us about the student's previous academic history and which grade they're applying for.",
  campus: "Select your preferred campus and program options for the application.",
  additional: "Provide any additional information that may help us better understand the student's needs.",
  review: "Please review all information before final submission. You can edit any section by clicking 'Edit'.",
};

const FormStepContent = () => {
  const { currentStep } = useApplicationForm();

  switch (currentStep) {
    case "student":
      return <StudentInformationForm />;
    case "guardian":
      return <GuardianInformationForm />;
    case "academic":
      return <AcademicInformationForm />;
    case "campus":
      return <CampusPreferenceForm />;
    case "additional":
      return <AdditionalInformationForm />;
    case "review":
      return <ApplicationReview />;
    case "submitted":
      return <ApplicationSubmitted />;
    default:
      return <StudentInformationForm />;
  }
};

const ApplicationFormContent = () => {
  const { currentStep } = useApplicationForm();

  return (
    <div className="w-full mx-auto">
      {currentStep !== "submitted" && (
        <ApplicationFormProgress />
      )}

      {currentStep !== "submitted" && stepHelpText[currentStep as keyof typeof stepHelpText] && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700 font-body">
            {stepHelpText[currentStep as keyof typeof stepHelpText]}
          </p>
        </div>
      )}

      <Card className="border-none shadow-lg mb-6">
        <CardContent className="pt-6">
          <FormStepContent />
        </CardContent>
      </Card>

      {currentStep !== "submitted" && (
        <ApplicationFormNavigation />
      )}

      {/* Support Information */}
      {currentStep !== "submitted" && (
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-kinder-blue" />
            Need help? Contact our admissions team at <span className="font-medium">admissions@cleversorigin.edu</span> or call <span className="font-medium">+256 750 123456</span>
          </p>
        </div>
      )}
    </div>
  );
};

const ApplicationForm = () => {
  return (
    <ApplicationFormProvider>
      <ApplicationFormContent />
    </ApplicationFormProvider>
  );
};

export default ApplicationForm;