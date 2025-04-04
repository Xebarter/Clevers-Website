"use client";

import React from "react";
import { useApplicationForm } from "./ApplicationFormProvider";
import { User, Users, BookOpen, School, FileText, CreditCard, ClipboardCheck } from "lucide-react";

// Reusable step component for better organization
const ProgressStep = ({ step, isCurrent, isCompleted, onClick, disabled }) => {
  const StepIcon = step.icon;
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center ${
        isCurrent
          ? `text-${step.color} font-bold`
          : isCompleted
          ? "text-gray-600 cursor-pointer hover:text-gray-800"
          : "text-gray-300"
      }`}
      disabled={disabled}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 border transition-all duration-300 ${
          isCurrent
            ? `bg-${step.color}/10 border-${step.color} text-${step.color}`
            : isCompleted
            ? "bg-gray-100 border-gray-300 text-gray-500"
            : "bg-gray-50 border-gray-200 text-gray-300"
        }`}
      >
        <StepIcon className="h-4 w-4" />
      </div>
      <span className="text-xs">{step.label}</span>
    </button>
  );
};

const ApplicationFormProgress = () => {
  const { progress, currentStep, goToStep } = useApplicationForm();

  // Define steps with their properties
  const steps = [
    { id: "student", label: "Student", icon: User, color: "kinder-blue" },
    { id: "guardian", label: "Guardian", icon: Users, color: "kinder-purple" },
    { id: "academic", label: "Academic", icon: BookOpen, color: "kinder-green" },
    { id: "campus", label: "Campus", icon: School, color: "kinder-red" },
    { id: "additional", label: "Additional", icon: FileText, color: "kinder-orange" },
    { id: "payment", label: "Payment", icon: CreditCard, color: "kinder-yellow" },
    { id: "review", label: "Review", icon: ClipboardCheck, color: "kinder-pink" },
  ];

  // Get current step index for calculations
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-6">
      {/* Hide step circles on mobile, show only progress bar */}
      <div className="hidden md:flex justify-between mb-3">
        {steps.map((step, index) => (
          <ProgressStep
            key={step.id}
            step={step}
            isCurrent={currentStep === step.id}
            isCompleted={currentStepIndex > index}
            onClick={() => {
              if (index <= currentStepIndex) {
                goToStep(step.id as any);
              }
            }}
            disabled={currentStepIndex < index}
          />
        ))}
      </div>

      {/* Colorful progress bar */}
      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-kinder-blue via-kinder-pink to-kinder-yellow rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress indicator */}
      <div className="flex justify-between text-xs mt-2">
        <span className="text-kinder-blue font-medium">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
        <span className="font-medium text-kinder-purple">
          {steps[currentStepIndex]?.label} Information
        </span>
      </div>
    </div>
  );
};

export default ApplicationFormProgress;
