"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema with Zod
export const applicationFormSchema = z.object({
  // Student Information
  student: z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender",
    }),
    nationality: z.string().min(1, { message: "Nationality is required" }),
    religion: z.string().optional(),
  }),

  // Parent/Guardian Information
  guardian: z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    relationship: z.string().min(1, { message: "Relationship is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
    occupation: z.string().optional(),
    address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  }),

  // Academic Information
  academic: z.object({
    appliedGrade: z.string().min(1, { message: "Please select the grade applying for" }),
    previousSchool: z.string().optional(),
    previousGrade: z.string().optional(),
    academicRecords: z.boolean().optional(),
  }),

  // Campus Selection
  campusPreference: z.object({
    campus: z.enum(["kitintale", "kasokoso", "maganjo"], {
      required_error: "Please select a campus",
    }),
    admissionTerm: z.enum(["term1", "term2", "term3"], {
      required_error: "Please select an admission term",
    }),
    residentialOption: z.enum(["day", "boarding"], {
      required_error: "Please select a residential option",
    }),
  }),

  // Additional Information
  additional: z.object({
    specialNeeds: z.boolean().optional(),
    specialNeedsDetails: z.string().optional(),
    healthConditions: z.boolean().optional(),
    healthConditionsDetails: z.string().optional(),
    howDidYouHear: z.string().optional(),
    additionalComments: z.string().optional(),
  }),

  // Payment Information
  payment: z.object({
    method: z.enum(["mobile", "card", "bank"], {
      required_error: "Please select a payment method",
    }),
    status: z.enum(["initial", "processing", "success", "error"]).default("initial"),
    reference: z.string().optional(),
    transactionDate: z.string().optional(),
    paymentComplete: z.boolean().default(false),
  }),

  // Terms and Conditions
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

// Default values for the form
const defaultValues: ApplicationFormValues = {
  student: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    nationality: "",
    religion: "",
  },
  guardian: {
    firstName: "",
    lastName: "",
    relationship: "",
    email: "",
    phone: "",
    occupation: "",
    address: "",
  },
  academic: {
    appliedGrade: "",
    previousSchool: "",
    previousGrade: "",
    academicRecords: false,
  },
  campusPreference: {
    campus: "kitintale",
    admissionTerm: "term1",
    residentialOption: "day",
  },
  additional: {
    specialNeeds: false,
    specialNeedsDetails: "",
    healthConditions: false,
    healthConditionsDetails: "",
    howDidYouHear: "",
    additionalComments: "",
  },
  payment: {
    method: "mobile",
    status: "initial",
    reference: "",
    transactionDate: "",
    paymentComplete: false,
  },
  termsAccepted: false,
};

type FormStep = "student" | "guardian" | "academic" | "campus" | "additional" | "payment" | "review" | "submitted";

interface FormContextType {
  currentStep: FormStep;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: FormStep) => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  progress: number; // 0-100
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

  // Update the steps array to include payment:
  const steps: FormStep[] = ["student", "guardian", "academic", "campus", "additional", "payment", "review"];

  const currentStepIndex = steps.indexOf(currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const goToStep = (step: FormStep) => {
    if (steps.includes(step)) {
      setCurrentStep(step);
    }
  };

  // Calculate progress (0-100)
  const progress = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  const formContextValue: FormContextType = {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isLastStep,
    isFirstStep,
    progress,
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
