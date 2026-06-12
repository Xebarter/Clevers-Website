"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  User,
  Phone,
  Mail,
  School,
  Home,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const campuses = [
  { name: "Kitintale", options: ["Day", "Boarding"] },
  { name: "Kasokoso", options: ["Day"] },
  { name: "Maganjo", options: ["Day", "Boarding"] },
];

const INITIAL_FORM_STATE = {
  studentName: "",
  dateOfBirth: "",
  gender: "",
  gradeLevel: "",
  parentName: "",
  relationship: "",
  phone: "",
  email: "",
  campus: "",
  boarding: "",
  previousSchool: "",
  specialNeeds: "",
  howHeard: "",
};

const fieldClass =
  "h-10 pl-11 pr-3 border-gray-200 bg-white shadow-sm focus-visible:ring-green-500/30 focus-visible:border-green-400";
const selectClass = cn(fieldClass, "w-full rounded-md border text-sm appearance-none");
const textareaClass =
  "min-h-[88px] pl-11 pr-3 py-2 border-gray-200 bg-white shadow-sm focus-visible:ring-green-500/30 focus-visible:border-green-400 resize-y";

function isSuccessStatus(message: string | null) {
  if (!message) return false;
  return /success/i.test(message) || message.includes("Reference:");
}

function FormSection({
  step,
  icon: Icon,
  title,
  description,
  children,
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/60 p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-5 pb-4 border-b border-gray-100">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 ring-1 ring-green-100 shadow-sm">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">
              Step {step}
            </span>
          </div>
          <h3 className="text-base font-semibold text-gray-900 tracking-tight mt-0.5">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function IconField({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

function IconTextarea({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <Icon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
    </div>
  );
}

export default function ApplicationForm() {
  const [formData, setFormData] = useState(() => ({ ...INITIAL_FORM_STATE }));
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<{
    applicationId?: string;
    submittedAt?: string;
    studentName?: string;
    parentName?: string;
    email?: string;
    phone?: string;
    campus?: string;
    gradeLevel?: string;
  } | null>(null);
  const hasAutoDownloadedRef = useRef(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (id === "campus") {
      const selectedCampus = campuses.find((c) => c.name === value);
      const boardingOptions = selectedCampus?.options || [];
      const newBoardingValue = boardingOptions.includes(formData.boarding) ? formData.boarding : "";
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        boarding: newBoardingValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const downloadPDFForApplicationId = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const applicationData = await response.json();
        const { generateApplicationPDF } = await import("../lib/pdf");
        generateApplicationPDF(applicationData);
      } else {
        const errorData = await response.json();
        const errorMessage =
          typeof errorData?.details === "string" && errorData.details
            ? `${errorData.error || "Failed"}: ${errorData.details}`
            : errorData.error || "Application not found";
        setStatus(`Failed to download PDF: ${errorMessage}`);
        console.error("PDF download error:", errorData);
      }
    } catch (error) {
      setStatus("An error occurred while downloading the PDF.");
      console.error("PDF download error:", error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!submissionDetails?.applicationId) {
      setStatus("No application ID available for download.");
      return;
    }
    await downloadPDFForApplicationId(submissionDetails.applicationId);
  };

  const resetForm = () => {
    setFormData({ ...INITIAL_FORM_STATE });
  };

  const formatErrorDetails = (details: unknown) => {
    if (!details || typeof details !== "object") {
      return null;
    }

    const messages = Object.values(details as Record<string, unknown>)
      .flatMap((value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return [value];
      })
      .map((value) => (typeof value === "string" ? value : String(value)))
      .filter(Boolean);

    return messages.length ? messages.join(" ") : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    setSubmissionDetails(null);
    hasAutoDownloadedRef.current = false;

    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        let applicationId: string | undefined;
        if (result.applicationId) {
          applicationId = result.applicationId;
        } else if (result.data && result.data.applicationId) {
          applicationId = result.data.applicationId;
        } else if (result.id) {
          applicationId = result.id;
        }

        const submittedAt: string | undefined =
          result.metadata?.submittedAt || new Date().toISOString();
        const successMessage = result.message || "Application submitted successfully!";

        setStatus(
          applicationId
            ? `${successMessage} Reference: ${applicationId}`
            : `${successMessage} Please proceed to payment.`
        );

        setSubmissionDetails({
          applicationId: applicationId || undefined,
          submittedAt,
          studentName: formData.studentName,
          parentName: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          campus: formData.campus,
          gradeLevel: formData.gradeLevel,
        });

        resetForm();

        if (applicationId) {
          setShowDownloadModal(true);
          hasAutoDownloadedRef.current = true;
          void downloadPDFForApplicationId(applicationId);
        } else {
          setStatus(
            "Application submitted! Please proceed with payment to complete your application."
          );
        }
      } else {
        const detailedError = formatErrorDetails(result.details);
        setStatus(detailedError || result.error || "Failed to submit application. Please try again.");
        setShowDownloadModal(false);
      }
    } catch {
      setStatus("An error occurred. Please try again later.");
      setShowDownloadModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showDownloadModal) return;
    if (!submissionDetails?.applicationId) return;
    if (hasAutoDownloadedRef.current) return;

    hasAutoDownloadedRef.current = true;
    void handleDownloadPDF();
  }, [showDownloadModal, submissionDetails?.applicationId]);

  const statusIsSuccess = isSuccessStatus(status);

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <FormSection
          step={1}
          icon={User}
          title="Student information"
          description="Tell us about the student applying for admission."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="studentName">
                Full name <span className="text-red-500">*</span>
              </Label>
              <IconField icon={User}>
                <Input
                  type="text"
                  id="studentName"
                  className={fieldClass}
                  placeholder="Student's full name"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                />
              </IconField>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dateOfBirth">
                Date of birth <span className="text-red-500">*</span>
              </Label>
              <IconField icon={Calendar}>
                <Input
                  type="date"
                  id="dateOfBirth"
                  className={fieldClass}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </IconField>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </Label>
              <IconField icon={User}>
                <select
                  id="gender"
                  className={selectClass}
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </IconField>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gradeLevel">
                Grade level <span className="text-red-500">*</span>
              </Label>
              <IconField icon={BookOpen}>
                <select
                  id="gradeLevel"
                  className={selectClass}
                  value={formData.gradeLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select grade level</option>
                  <option value="nursery">Nursery</option>
                  <option value="kindergarten">Kindergarten</option>
                  <option value="p1">Primary 1</option>
                  <option value="p2">Primary 2</option>
                  <option value="p3">Primary 3</option>
                  <option value="p4">Primary 4</option>
                  <option value="p5">Primary 5</option>
                  <option value="p6">Primary 6</option>
                  <option value="p7">Primary 7</option>
                </select>
              </IconField>
            </div>
          </div>
        </FormSection>

        <FormSection
          step={2}
          icon={User}
          title="Parent / guardian"
          description="Primary contact details for the admissions team."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="parentName">
                Full name <span className="text-red-500">*</span>
              </Label>
              <IconField icon={User}>
                <Input
                  type="text"
                  id="parentName"
                  className={fieldClass}
                  placeholder="Parent or guardian's full name"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                />
              </IconField>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="relationship">
                Relationship <span className="text-red-500">*</span>
              </Label>
              <IconField icon={User}>
                <select
                  id="relationship"
                  className={selectClass}
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="other">Other</option>
                </select>
              </IconField>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Phone number <span className="text-red-500">*</span>
              </Label>
              <IconField icon={Phone}>
                <Input
                  type="tel"
                  id="phone"
                  className={fieldClass}
                  placeholder="+256 700 123 456"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </IconField>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email address <span className="text-red-500">*</span>
              </Label>
              <IconField icon={Mail}>
                <Input
                  type="email"
                  id="email"
                  className={fieldClass}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </IconField>
            </div>
          </div>
        </FormSection>

        <FormSection
          step={3}
          icon={School}
          title="Campus preference"
          description="Choose your preferred campus and day or boarding option."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="campus">
                Preferred campus <span className="text-red-500">*</span>
              </Label>
              <IconField icon={School}>
                <select
                  id="campus"
                  className={selectClass}
                  value={formData.campus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select campus</option>
                  {campuses.map((campus) => (
                    <option key={campus.name} value={campus.name}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </IconField>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="boarding">
                Day or boarding <span className="text-red-500">*</span>
              </Label>
              <IconField icon={Home}>
                <select
                  id="boarding"
                  className={cn(selectClass, !formData.campus && "opacity-60 cursor-not-allowed")}
                  value={formData.boarding}
                  onChange={handleChange}
                  required
                  disabled={!formData.campus}
                >
                  <option value="">
                    {formData.campus ? "Select preference" : "Select a campus first"}
                  </option>
                  {formData.campus &&
                    campuses
                      .find((c) => c.name === formData.campus)
                      ?.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                </select>
              </IconField>
            </div>
          </div>
        </FormSection>

        <FormSection
          step={4}
          icon={BookOpen}
          title="Additional information"
          description="Optional details that help us better support your child."
        >
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="previousSchool">Previous school</Label>
              <IconField icon={School}>
                <Input
                  type="text"
                  id="previousSchool"
                  className={fieldClass}
                  placeholder="Name of previous school (if any)"
                  value={formData.previousSchool}
                  onChange={handleChange}
                />
              </IconField>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="specialNeeds">Special needs or accommodations</Label>
              <IconTextarea icon={BookOpen}>
                <Textarea
                  id="specialNeeds"
                  rows={3}
                  className={textareaClass}
                  placeholder="Let us know if your child has any special requirements"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                />
              </IconTextarea>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="howHeard">
                How did you hear about us? <span className="text-red-500">*</span>
              </Label>
              <IconField icon={BookOpen}>
                <select
                  id="howHeard"
                  className={selectClass}
                  value={formData.howHeard}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="website">School website</option>
                  <option value="referral">Friend or family referral</option>
                  <option value="social">Social media</option>
                  <option value="event">School event</option>
                  <option value="other">Other</option>
                </select>
              </IconField>
            </div>
          </div>
        </FormSection>

        {status && (
          <div
            role="alert"
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 text-sm",
              statusIsSuccess
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            )}
          >
            {statusIsSuccess ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            )}
            <p className="leading-relaxed">{status}</p>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 p-4 backdrop-blur-sm md:static md:z-auto md:mt-2 md:rounded-xl md:border md:border-gray-100 md:bg-gray-50/80 md:p-5 md:backdrop-blur-none">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 text-white font-semibold shadow-md hover:opacity-95 hover:shadow-lg transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting application…
              </>
            ) : (
              "Submit application"
            )}
          </Button>
          <p className="hidden md:block text-xs text-gray-500 text-center mt-3">
            By submitting, you confirm the information provided is accurate.
          </p>
        </div>
      </form>

      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Application submitted</DialogTitle>
            <DialogDescription className="text-center">
              Your application has been received. A copy of your form is ready to download.
            </DialogDescription>
          </DialogHeader>
          {submissionDetails?.applicationId && (
            <p className="text-center text-sm text-gray-600">
              Reference:{" "}
              <span className="font-mono font-semibold text-green-700">
                {submissionDetails.applicationId}
              </span>
            </p>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleDownloadPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Download application (PDF)
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowDownloadModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
