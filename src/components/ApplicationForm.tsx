"use client";

import React, { useState, useEffect } from "react";
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState<{ applicationId?: string; submittedAt?: string, orderTrackingId?: string, studentName?: string, parentName?: string, email?: string, phone?: string, campus?: string, gradeLevel?: string } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionDetails?.orderTrackingId) return;

    const checkPaymentStatus = async () => {
      try {
        // Use the existing check-payment-status API
        const response = await fetch(`/api/check-payment-status/${submissionDetails.orderTrackingId}`, {
          method: "GET",
        });

        if (response.ok) {
          const result = await response.json();

          if (result.payment_status_description === "COMPLETED" || result.payment_status_description === "PAID") {
            // Payment completed, show download button
            setPaymentStatus("Payment completed successfully! You can now download your application form.");
          } else if (result.payment_status_description === "FAILED" || result.payment_status_description === "CANCELLED") {
            setPaymentStatus(`Payment ${result.payment_status_description.toLowerCase()}. Please try again.`);
          }
        } else {
          console.error("Failed to check payment status:", response.status);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    // Check status immediately
    checkPaymentStatus();

    // Then check every 10 seconds for up to 10 minutes
    const intervalId = setInterval(checkPaymentStatus, 10000);
    const timeoutId = setTimeout(() => clearInterval(intervalId), 600000); // 10 minutes

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [submissionDetails?.orderTrackingId]);

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

  const paymentLink = "https://store.pesapal.com/cleversapplication";

  const handlePayment = async () => {
    if (!submissionDetails?.applicationId) return;

    setIsProcessingPayment(true);
    setPaymentStatus("Initiating payment...");

    try {
      // Extract first and last names: prefer current form values, otherwise use saved submissionDetails
      const studentNameRaw = formData.studentName?.trim() || submissionDetails?.studentName?.trim() || "";
      const parentNameRaw = formData.parentName?.trim() || submissionDetails?.parentName?.trim() || "";

      const studentNameParts = studentNameRaw ? studentNameRaw.split(/\s+/) : [];
      const parentNameParts = parentNameRaw ? parentNameRaw.split(/\s+/) : [];

      let firstName, lastName;

      // If we have student name, use it, otherwise use parent name
      if (studentNameParts.length > 0 && studentNameParts[0]) {
        firstName = studentNameParts[0];
        lastName = studentNameParts.length > 1 ? studentNameParts.slice(1).join(' ') : firstName;
      } else if (parentNameParts.length > 0 && parentNameParts[0]) {
        firstName = parentNameParts[0];
        lastName = parentNameParts.length > 1 ? parentNameParts.slice(1).join(' ') : firstName;
      } else {
        // If both are empty, we can't proceed
        setPaymentStatus("Cannot initiate payment: student name or parent name is required");
        return;
      }

      // Prepare billing data for the payment API. Use form values or fall back to saved submissionDetails.
      const billingData = {
        firstName: firstName || '',
        lastName: lastName || '',
        email: formData.email || submissionDetails?.email || '',
        phoneNumber: formData.phone || submissionDetails?.phone || '',
        amount: 50000, // UGX 50,000 as a number
        campus: formData.campus || submissionDetails?.campus || '',
        gradeLevel: formData.gradeLevel || submissionDetails?.gradeLevel || '',
      };

      // Call API to create Pesapal payment order for applications
      const response = await fetch("/api/applications/pesapal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billingData),
      });

      const rawBody = await response.text();
      const result = (() => {
        try {
          return rawBody ? JSON.parse(rawBody) : {};
        } catch {
          return {};
        }
      })();

      if (response.ok && result.url) {
        // Store the application ID as order tracking ID for status checking
        setSubmissionDetails(prev => ({
          ...prev,
          orderTrackingId: result.applicationId  // Using application ID for tracking
        }));

        // Redirect to Pesapal
        window.location.href = result.url;  // Direct redirect instead of opening in new tab
        setPaymentStatus("Redirecting to payment gateway...");
      } else {
        const message =
          result?.error ||
          result?.detail ||
          result?.details ||
          `Failed to initiate payment (HTTP ${response.status})`;
        setPaymentStatus(message);
        console.error("Payment initiation failed:", {
          status: response.status,
          statusText: response.statusText,
          body: rawBody,
        });
      }
    } catch (error) {
      setPaymentStatus("An error occurred during payment initiation");
      console.error("Payment initiation error:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!submissionDetails?.applicationId) return;

    try {
      // Fetch application details to generate PDF
      const response = await fetch(`/api/applications/${submissionDetails.applicationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const applicationData = await response.json();

        // Dynamically import jsPDF to avoid SSR issues
        const { generateApplicationPDF } = await import('../lib/pdf');
        generateApplicationPDF(applicationData);
      } else {
        setStatus("Failed to download PDF. Application not found.");
      }
    } catch (error) {
      setStatus("An error occurred while downloading the PDF.");
      console.error("PDF download error:", error);
    }
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
    setPaymentStatus(null);

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
        const applicationId: string | undefined = result.applicationId;
        const submittedAt: string | undefined = result.metadata?.submittedAt;
        const successMessage = result.message || "Application submitted successfully!";

        setStatus(
          applicationId
            ? `${successMessage} Reference: ${applicationId}`
            : `${successMessage} Please proceed to payment.`,
        );
        setSubmissionDetails({
          applicationId,
          submittedAt,
          studentName: formData.studentName,
          parentName: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          campus: formData.campus,
          gradeLevel: formData.gradeLevel,
        });
        resetForm();
        setShowPaymentModal(true);
      } else {
        const detailedError = formatErrorDetails(result.details);
        setStatus(detailedError || result.error || "Failed to submit application. Please try again.");
        setShowPaymentModal(false);
      }
    } catch (error) {
      setStatus("An error occurred. Please try again later.");
      setShowPaymentModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="mt-3 inline-block bg-amber-100 text-amber-800 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border border-amber-200">
            Application Fee: <span className="font-bold">UGX 50,000</span> (payable on submission)
          </div>
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

          {/* Payment Modal */}
          {showPaymentModal && (
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
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">Application Fee Payment</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                    type="button"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <h4 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">Pay Application Fee</h4>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                    Pay <span className="font-bold text-blue-600">UGX 50,000</span> to complete your application.
                  </p>
                  {submissionDetails?.applicationId && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      Reference: <span className="font-mono font-semibold text-blue-600">{submissionDetails.applicationId}</span>
                    </p>
                  )}

                  {paymentStatus && (
                    <div className={`p-3 rounded-lg mb-3 text-xs sm:text-sm ${typeof paymentStatus === 'string' && paymentStatus.includes('successfully') ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {typeof paymentStatus === 'string' ? paymentStatus : String(paymentStatus)}
                    </div>
                  )}

                  {isProcessingPayment && (
                    <div className="flex justify-center mb-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:gap-3">
                  {!(typeof paymentStatus === 'string' && paymentStatus.includes("completed")) ? (
                    <>
                      <Button
                        type="button"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs sm:text-sm py-2 sm:py-2.5"
                        onClick={handlePayment}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? "Processing..." : "Pay Now with Pesapal"}
                      </Button>
                      <Button
                        type="button"
                        className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs sm:text-sm py-2 sm:py-2.5"
                        onClick={() => setShowPaymentModal(false)}
                      >
                        Close
                      </Button>
                    </>
                  ) : (
                    <>
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
                        onClick={() => setShowPaymentModal(false)}
                      >
                        Close
                      </Button>
                    </>
                  )}
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
              {isSubmitting ? "Submitting..." : "Submit & Proceed to Payment"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}