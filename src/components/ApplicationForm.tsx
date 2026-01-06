"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, User, Phone, Mail, School, Home, BookOpen, CheckCircle, CreditCard, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ApplicationForm() {
  const [formData, setFormData] = useState(() => ({ ...INITIAL_FORM_STATE }));
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<{ applicationId?: string; submittedAt?: string, studentName?: string, parentName?: string, email?: string, phone?: string, campus?: string, gradeLevel?: string } | null>(null);
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
        // Extract application ID from the response
        // The response might contain the ID directly or in a nested property
        let applicationId: string | undefined;
        if (result.applicationId) {
          applicationId = result.applicationId;
        } else if (result.data && result.data.applicationId) {
          applicationId = result.data.applicationId;
        } else if (result.id) {
          applicationId = result.id;
        }

        const submittedAt: string | undefined = result.metadata?.submittedAt || new Date().toISOString();
        const successMessage = result.message || "Application submitted successfully!";

        setStatus(
          applicationId
            ? `${successMessage} Reference: ${applicationId}`
            : `${successMessage} Please proceed to payment.`,
        );
        
        // Store submission details, ensuring we have the application ID if available
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
        
        // Only show the download modal if we have an application ID
        if (applicationId) {
          setShowDownloadModal(true);
          hasAutoDownloadedRef.current = true;
          void downloadPDFForApplicationId(applicationId);
        } else {
          // If no ID is available, show a message that user should proceed to payment
          // and the download will be available after payment completion
          setStatus("Application submitted! Please proceed with payment to complete your application.");
        }
      } else {
        const detailedError = formatErrorDetails(result.details);
        setStatus(detailedError || result.error || "Failed to submit application. Please try again.");
        setShowDownloadModal(false);
      }
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-blue-100 p-4 sm:p-6 lg:p-8"
      >
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-blue-600">
            Student Application Form
          </h2>
          <p className="text-blue-500 text-sm sm:text-base lg:text-lg">
            Complete all required fields marked with <span className="text-red-500">*</span>
          </p>
        </div>

        <form className="space-y-4 sm:space-y-6 lg:space-y-8" onSubmit={handleSubmit}>
          {/* Student Information */}
          <div className="bg-blue-50 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-blue-600 flex items-center">
              <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 text-blue-500" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div>
                <label htmlFor="studentName" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="studentName"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70"
                    placeholder="Student's full name"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                  />
                  <User className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-blue-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="dateOfBirth"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                  <Calendar className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-blue-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
              <div>
                <label htmlFor="gender" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70 appearance-none"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <User className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-blue-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
              <div>
                <label htmlFor="gradeLevel" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Grade Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="gradeLevel"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70 appearance-none"
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
                  <BookOpen className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-blue-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div className="bg-purple-50 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-purple-600 flex items-center">
              <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 text-purple-500" />
              Parent/Guardian Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div>
                <label htmlFor="parentName" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="parentName"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70"
                    placeholder="Parent/guardian's full name"
                    value={formData.parentName}
                    onChange={handleChange}
                    required
                  />
                  <User className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-purple-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
              <div>
                <label htmlFor="relationship" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="relationship"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70 appearance-none"
                    value={formData.relationship}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="other">Other</option>
                  </select>
                  <User className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-purple-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70"
                    placeholder="+256 700 123 456"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <Phone className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-purple-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Mail className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-purple-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Campus and Boarding Information */}
          <div className="bg-green-50 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-green-600 flex items-center">
              <School className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 text-green-500" />
              Campus and Boarding Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div>
                <label htmlFor="campus" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Preferred Campus <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="campus"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70 appearance-none"
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
                  <School className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-green-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
              <div>
                <label htmlFor="boarding" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Boarding Option <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="boarding"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70 appearance-none"
                    value={formData.boarding}
                    onChange={handleChange}
                    required
                    disabled={!formData.campus}
                  >
                    <option value="">Select boarding preference</option>
                    {formData.campus &&
                      campuses
                        .find((c) => c.name === formData.campus)
                        ?.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                  </select>
                  <Home className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-green-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-amber-50 p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-amber-600 flex items-center">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 text-amber-500" />
              Additional Information
            </h3>
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div>
                <label htmlFor="previousSchool" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Previous School
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="previousSchool"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70"
                    placeholder="Previous school's name"
                    value={formData.previousSchool}
                    onChange={handleChange}
                  />
                  <School className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-amber-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
              <div>
                <label htmlFor="specialNeeds" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  Special Needs
                </label>
                <div className="relative">
                  <textarea
                    id="specialNeeds"
                    rows={3}
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70"
                    placeholder="Special needs or accommodations"
                    value={formData.specialNeeds}
                    onChange={handleChange}
                  />
                  <BookOpen className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-amber-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
              <div>
                <label htmlFor="howHeard" className="block mb-1 text-xs sm:text-sm font-medium text-gray-700">
                  How Did You Hear About Us? <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="howHeard"
                    className="w-full p-2.5 sm:p-3 pl-10 sm:pl-11 lg:pl-12 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-sm sm:text-base placeholder-gray-400 placeholder-opacity-70 appearance-none"
                    value={formData.howHeard}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="website">School Website</option>
                    <option value="referral">Friend/Family Referral</option>
                    <option value="social">Social Media</option>
                    <option value="event">School Event</option>
                    <option value="other">Other</option>
                  </select>
                  <BookOpen className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-amber-500 absolute left-2.5 sm:left-3 lg:left-3.5 top-2.5 sm:top-3 lg:top-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Download Modal - replaces payment modal */}
          {showDownloadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md"
              >
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">Application Submitted</h3>
                  <button
                    onClick={() => setShowDownloadModal(false)}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                    type="button"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <h4 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Application Successfully Submitted!</h4>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                    Your application has been received and is being processed.
                  </p>
                  {submissionDetails?.applicationId && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      Reference: <span className="font-mono font-semibold text-blue-600">{submissionDetails.applicationId}</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <Button
                    type="button"
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm py-2 sm:py-2.5"
                    onClick={handleDownloadPDF}
                  >
                    Download Application Form (PDF)
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs sm:text-sm py-2 sm:py-2.5"
                    onClick={() => setShowDownloadModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Submission Status and Button */}
          {status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 sm:p-4 rounded-lg ${typeof status === 'string' && status.includes("success") ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"}`}
            >
              <p className={`text-xs sm:text-sm flex items-center ${typeof status === 'string' && status.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {typeof status === 'string' && status.includes("success") ? (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                ) : (
                  <span className="flex h-4 w-4 sm:h-5 sm:w-5 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-red-500"></span>
                  </span>
                )}
                {status}
              </p>
            </motion.div>
          )}

          {/* Submission Area */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:relative md:bg-transparent md:border-0 md:p-0">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 md:h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}