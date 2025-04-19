"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { useApplicationForm } from "./ApplicationFormProvider";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

const ApplicationFormNavigation = () => {
  const { 
    currentStep,
    goToNextStep, 
    goToPreviousStep, 
    isFirstStep, 
    isLastStep,
    steps
  } = useApplicationForm();
  
  const { trigger, formState: { isValid, isSubmitting, errors } } = useFormContext();

  const handleNext = async () => {
    // Validate only the current step's fields
    const isStepValid = await trigger(getStepFields(currentStep));
    if (isStepValid) {
      goToNextStep();
    }
  };

  // Helper function to get fields for current step
  const getStepFields = (step: string) => {
    switch(step) {
      case 'student': return ['student'];
      case 'guardian': return ['guardian'];
      case 'academic': return ['academic'];
      case 'campus': return ['campusPreference'];
      case 'additional': return ['additional'];
      case 'review': return ['termsAccepted'];
      default: return [];
    }
  };

  return (
    <div className="flex justify-between mt-8 gap-4">
      {/* Back Button - Only show if not first step */}
      {!isFirstStep && (
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isSubmitting}
          className="gap-2 flex-1 sm:flex-initial"
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      {/* Next/Submit Button */}
      <Button
        onClick={handleNext}
        disabled={isSubmitting}
        className={`gap-2 flex-1 sm:flex-initial ${
          isLastStep ? 'bg-green-600 hover:bg-green-700' : ''
        }`}
        type={isLastStep ? "submit" : "button"}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isLastStep ? 'Submitting...' : 'Validating...'}
          </>
        ) : isLastStep ? (
          <>
            Submit Application
            <CheckCircle className="h-4 w-4" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ApplicationFormNavigation;