"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, User, Phone, Mail, School, Home, BookOpen, CheckCircle, CreditCard, X } from "lucide-react";

const campuses = [
  { name: "Kitintale", options: ["Day", "Boarding"] },
  { name: "Kasokoso", options: ["Day"] },
  { name: "Maganjo", options: ["Day", "Boarding"] },
];

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
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
  });
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    
    if (id === "campus") {
      // Get available boarding options for the selected campus
      const selectedCampus = campuses.find(c => c.name === value);
      const boardingOptions = selectedCampus?.options || [];
      
      // Reset boarding selection if current selection is not valid for the new campus
      const newBoardingValue = boardingOptions.includes(formData.boarding) 
        ? formData.boarding 
        : "";
      
      setFormData(prev => ({
        ...prev,
        [id]: value,
        boarding: newBoardingValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const paymentLink = "https://store.pesapal.com/cleversapplication";

  const handleRedirectToPayment = () => {
    window.location.href = paymentLink;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

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
        setStatus("Application submitted successfully! Please proceed to payment.");
        // Show the payment modal instead of resetting form
        setShowPaymentModal(true);
      } else {
        setStatus(result.error || "Failed to submit application. Please try again.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-lg border border-blue-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 text-blue-600">Student Application Form</h2>
        <p className="text-blue-500">Please complete all required fields marked with <span className="text-red-500">*</span></p>
        <div className="mt-2 inline-block bg-amber-100 text-amber-800 text-sm px-4 py-2 rounded-md border border-amber-200">
          Application Fee: <span className="font-bold">UGX 50,000</span> (payable on submission)
        </div>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Student Information */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold mb-4 text-blue-600 flex items-center">
            <User className="h-6 w-6 mr-2 text-blue-500" />
            Student Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="studentName" className="block mb-2 text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="studentName"
                  className="w-full p-3 pl-10 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  placeholder="Enter student's full name"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                />
                <User className="h-5 w-5 text-blue-500 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dateOfBirth"
                  className="w-full p-3 pl-10 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                <Calendar className="h-5 w-5 text-blue-500 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="gender"
                  className="w-full p-3 pl-10 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <User className="h-5 w-5 text-blue-500 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="gradeLevel" className="block mb-2 text-sm font-medium text-gray-700">
                Grade Level Applying For <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="gradeLevel"
                  className="w-full p-3 pl-10 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
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
                <BookOpen className="h-5 w-5 text-blue-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Parent/Guardian Information */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-xl font-semibold mb-4 text-purple-600 flex items-center">
            <User className="h-6 w-6 mr-2 text-purple-500" />
            Parent/Guardian Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="parentName" className="block mb-2 text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="parentName"
                  className="w-full p-3 pl-10 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                  placeholder="Enter parent/guardian's full name"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                />
                <User className="h-5 w-5 text-purple-500 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="relationship" className="block mb-2 text-sm font-medium text-gray-700">
                Relationship to Student <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="relationship"
                  className="w-full p-3 pl-10 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="other">Other</option>
                </select>
                <User className="h-5 w-5 text-purple-500 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-3 pl-10 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                  placeholder="Enter phone number (e.g., +256 700 123 456)"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Phone className="h-5 w-5 text-purple-500 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 pl-10 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail className="h-5 w-5 text-purple-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Campus and Boarding Preference */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center">
            <School className="h-6 w-6 mr-2 text-green-500" />
            Campus and Boarding Preference
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="campus" className="block mb-2 text-sm font-medium text-gray-700">
                Campus <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="campus"
                  className="w-full p-3 pl-10 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
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
                <School className="h-5 w-5 text-green-500 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="boarding" className="block mb-2 text-sm font-medium text-gray-700">
                Boarding Preference <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="boarding"
                  className="w-full p-3 pl-10 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
                  value={formData.boarding}
                  onChange={handleChange}
                  required
                  disabled={!formData.campus}
                >
                  <option value="">Select boarding preference</option>
                  {formData.campus && campuses
                    .find(c => c.name === formData.campus)
                    ?.options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))
                  }
                </select>
                <Home className="h-5 w-5 text-green-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
          <h3 className="text-xl font-semibold mb-4 text-amber-600 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-amber-500" />
            Additional Information
          </h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="previousSchool" className="block mb-2 text-sm font-medium text-gray-700">
                Previous School (if applicable)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="previousSchool"
                  className="w-full p-3 pl-10 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  placeholder="Enter previous school's name"
                  value={formData.previousSchool}
                  onChange={handleChange}
                />
                <School className="h-5 w-5 text-amber-500 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="specialNeeds" className="block mb-2 text-sm font-medium text-gray-700">
                Special Needs or Accommodations (if any)
              </label>
              <div className="relative">
                <textarea
                  id="specialNeeds"
                  rows={4}
                  className="w-full p-3 pl-10 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  placeholder="Describe any special needs or accommodations"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                />
                <BookOpen className="h-5 w-5 text-amber-500 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="howHeard" className="block mb-2 text-sm font-medium text-gray-700">
                How Did You Hear About Us? <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="howHeard"
                  className="w-full p-3 pl-10 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
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
                <BookOpen className="h-5 w-5 text-amber-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-600">Application Fee</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-medium mb-2">Application Fee Payment</h4>
                <p className="text-gray-600 mb-4">Please pay the application fee of <span className="font-bold text-blue-600">UGX 50,000</span> to complete your application.</p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-700 text-sm mb-4">
                  Your application has been submitted successfully. Payment is required to finalize the application process.
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                  onClick={handleRedirectToPayment}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Submission Status and Button */}
        {status && (
          <div className={`p-4 rounded-lg ${status.includes("success") ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"}`}>
            <p className={`text-sm flex items-center ${status.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {status.includes("success") ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <span className="flex h-5 w-5 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
                </span>
              )}
              {status}
            </p>
          </div>
        )}
        
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium rounded-full shadow-lg transform transition hover:scale-105 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}