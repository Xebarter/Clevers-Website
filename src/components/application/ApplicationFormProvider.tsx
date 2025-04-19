"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema with Zod
export const applicationFormSchema = z.object({
  // ... (keep your existing schema exactly as is)
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

// Default values for the form
const defaultValues: ApplicationFormValues = {
  // ... (keep your existing default values exactly as is)
};

// Define steps in correct order
const FORM_STEPS = [
  "student",
  "guardian", 
  "academic",
  "campus",
  "additional",
  "review"
] as const;

type FormStep = typeof FORM_STEPS[number] | "submitted";

interface FormContextType {
  currentStep: FormStep;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: FormStep) => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  progress: number;
  steps: typeof FORM_STEPS;
}

const FormContext = createContext<FormContextType | null>(null);

export const useApplicationForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useApplicationForm must be used within an ApplicationFormProvider");
  }
  return context;
};

interface ApplicationFormProviderProps {
  children: React.ReactNode;
}

export const ApplicationFormProvider = ({ children }: ApplicationFormProviderProps) => {
  const methods = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const [currentStep, setCurrentStep] = useState<FormStep>("student");

  const currentStepIndex = FORM_STEPS.indexOf(currentStep as typeof FORM_STEPS[number]);
  const isLastStep = currentStep === "review";
  const isFirstStep = currentStep === "student";

  const goToNextStep = () => {
    if (currentStep === "review") {
      setCurrentStep("submitted");
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < FORM_STEPS.length) {
        setCurrentStep(FORM_STEPS[nextIndex]);
      }
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(FORM_STEPS[prevIndex]);
    }
  };

  const goToStep = (step: FormStep) => {
    if (step === "submitted" || FORM_STEPS.includes(step as any)) {
      setCurrentStep(step);
    }
  };

  const progress = Math.round(((currentStepIndex + 1) / FORM_STEPS.length) * 100);

  const formContextValue: FormContextType = {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isLastStep,
    isFirstStep,
    progress,
    steps: FORM_STEPS
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </FormContext.Provider>
  );
};

export default ApplicationFormProvider;