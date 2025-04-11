"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { useApplicationForm } from "./ApplicationFormProvider";
import { ArrowLeft, ArrowRight, CheckCircle, Rocket, Sparkles } from "lucide-react";
import type { ApplicationFormValues } from "./ApplicationFormProvider";
import { toast } from "sonner";

// Toast styling configurations for reuse
const TOAST_STYLES = {
  success: {
    style: {
      background: "#E6FFEA",
      color: "#66CC99",
      border: "2px solid #66CC99",
      borderRadius: "12px",
      fontFamily: "var(--font-varela-round)",
    },
    icon: <Rocket className="text-green-500" />,
  },
  error: {
    style: {
      background: "#FFE5E5",
      color: "#FF5757",
      border: "2px solid #FF5757",
      borderRadius: "12px",
      fontFamily: "var(--font-varela-round)",
    },
    icon: <Sparkles className="text-red-500" />,
  }
};

// Validate current step and return whether we can proceed
const validateCurrentStep = async (currentStep, trigger, getValues) => {
  switch (currentStep) {
    case "student":
      return await trigger("student");
    case "guardian":
      return await trigger("guardian");
    case "academic":
      return await trigger("academic");
    case "campus":
      return await trigger("campusPreference");
    case "additional":
      return await trigger("additional");
    case "payment":
      // Check if payment is complete
      const paymentComplete = getValues("payment.paymentComplete");
      if (!paymentComplete) {
        toast.error("Please complete the payment to proceed", TOAST_STYLES.error);
        return false;
      }
      return true;
    case "review":
      // On the review step, check the terms acceptance
      return await trigger("termsAccepted");
    default:
      return true;
  }
};

// Handle form submission
const handleSubmitApplication = async (goToNextStep) => {
  try {
    // This would typically be an API call to submit the form
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Hooray! Application submitted successfully! 🎉", TOAST_STYLES.success);
    goToNextStep(); // Go to submitted state
    return true;
  } catch (error) {
    toast.error("Oops! Failed to submit application. Please try again.", TOAST_STYLES.error);
    return false;
  }
};

const ApplicationFormNavigation = () => {
  const { currentStep, goToNextStep, goToPreviousStep, isFirstStep, isLastStep } = useApplicationForm();
  const { trigger, formState: { isSubmitting }, getValues } = useFormContext<ApplicationFormValues>();

  const handleNext = async () => {
    // Validate the current step's fields before proceeding
    const canProceed = await validateCurrentStep(currentStep, trigger, getValues);

    if (canProceed) {
      // If it's the review step and validation passed, submit application
      if (currentStep === "review") {
        await handleSubmitApplication(goToNextStep);
      } else {
        goToNextStep();
      }
    }
  };

  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={goToPreviousStep}
        disabled={isFirstStep || isSubmitting}
        className="gap-2 rounded-xl border-2 border-gray-300 hover:bg-gray-100 font-heading px-6 py-3 text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Button
        onClick={handleNext}
        disabled={isSubmitting}
        className={`gap-2 kinder-button ${
          isLastStep
            ? "bg-kinder-green border-green-600 hover:bg-kinder-green/90"
            : "bg-kinder-blue border-blue-600 hover:bg-kinder-blue/90"
        } px-6 py-3 shadow-lg`}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <Sparkles className="animate-spin mr-2 h-4 w-4" />
            Processing...
          </span>
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
