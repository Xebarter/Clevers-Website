"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  positions: string[];
  otherPosition: string;
  experience: string;
  education: string;
  skills: string;
  coverLetter: string;
  references: string;
  resume: File | null;
  certificates: File | null;
  otherDocuments: File | null;
}

const CareerApplicationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    positions: [],
    otherPosition: "",
    experience: "",
    education: "",
    skills: "",
    coverLetter: "",
    references: "",
    resume: null,
    certificates: null,
    otherDocuments: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const positions = [
    "Primary School Teacher",
    "Secondary School Teacher",
    "Nursery Teacher",
    "Mathematics Teacher",
    "Science Teacher",
    "Social Studies Teacher",
    "English Teacher",
    "Physical Education Teacher",
    "Music Teacher",
    "Art Teacher",
    "School Administrator",
    "Librarian",
    "School Counselor",
    "IT Support Staff",
    "Maintenance Staff",
    "Security Personnel",
    "Other",
  ];

  const experienceLevels = [
    "Fresh Graduate",
    "1-2 Years",
    "3-5 Years",
    "5-10 Years",
    "10+ Years",
  ];

  const educationLevels = [
    "Certificate",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePositionToggle = (position: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      positions: checked
        ? [...prev.positions, position]
        : prev.positions.filter((p) => p !== position),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one position is selected
    if (formData.positions.length === 0) {
      alert("Please select at least one position.");
      return;
    }

    // Validate otherPosition if "Other" is selected
    if (formData.positions.includes("Other") && !formData.otherPosition.trim()) {
      alert("Please specify the other position(s) you're applying for.");
      return;
    }

    // Validate experience is selected
    if (!formData.experience) {
      alert("Please select your years of experience.");
      return;
    }

    // Validate education is selected
    if (!formData.education) {
      alert("Please select your highest education level.");
      return;
    }

    // Validate resume is uploaded
    if (!formData.resume) {
      alert("Please upload your Resume/CV.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Create form data for submission
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      // Combine selected positions, adding otherPosition if "Other" is selected
      const selectedPositions = formData.positions.includes("Other") && formData.otherPosition
        ? [...formData.positions.filter(p => p !== "Other"), formData.otherPosition]
        : formData.positions;
      submitData.append("position", selectedPositions.join(", "));
      submitData.append("experience", formData.experience);
      submitData.append("education", formData.education);
      submitData.append("skills", formData.skills);
      submitData.append("coverLetter", formData.coverLetter);
      submitData.append("references", formData.references);
      if (formData.resume) {
        submitData.append("resume", formData.resume);
      }
      if (formData.certificates) {
        submitData.append("certificates", formData.certificates);
      }
      if (formData.otherDocuments) {
        submitData.append("otherDocuments", formData.otherDocuments);
      }

      const response = await fetch("/api/career-application", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          positions: [],
          otherPosition: "",
          experience: "",
          education: "",
          skills: "",
          coverLetter: "",
          references: "",
          resume: null,
          certificates: null,
          otherDocuments: null,
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Application Submitted Successfully!</p>
          <p className="text-sm">Thank you for your interest in joining Clevers' Origin Schools. We will review your application and contact you soon.</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Submission Failed</p>
          <p className="text-sm">There was an error submitting your application. Please try again later.</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your.email@example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="+256 700 000 000"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Your current address"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Position(s) / Job(s) You Can Do *</Label>
          <p className="text-sm text-gray-500 mb-3">Select all positions that apply to you</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
            {positions.map((pos) => (
              <div key={pos} className="flex items-center space-x-2">
                <Checkbox
                  id={`position-${pos}`}
                  checked={formData.positions.includes(pos)}
                  onCheckedChange={(checked) => handlePositionToggle(pos, checked as boolean)}
                />
                <label
                  htmlFor={`position-${pos}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {pos}
                </label>
              </div>
            ))}
          </div>
          {formData.positions.length === 0 && (
            <p className="text-sm text-red-500 mt-1">Please select at least one position</p>
          )}
          {formData.positions.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {formData.positions.join(", ")}
            </p>
          )}
        </div>

        {formData.positions.includes("Other") && (
          <div>
            <Label htmlFor="otherPosition">Please Specify Other Position(s) *</Label>
            <Input
              id="otherPosition"
              name="otherPosition"
              type="text"
              value={formData.otherPosition}
              onChange={handleInputChange}
              required
              placeholder="Enter the position(s) you're applying for"
              className="mt-1"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="experience">Years of Experience *</Label>
            <Select
              value={formData.experience}
              onValueChange={(value) => handleSelectChange("experience", value)}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="education">Highest Education Level *</Label>
            <Select
              value={formData.education}
              onValueChange={(value) => handleSelectChange("education", value)}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="skills">Skills & Qualifications</Label>
          <Textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="List your relevant skills, certifications, and qualifications..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-800">Upload Documents</h3>
          
          <div>
            <Label htmlFor="resume">Resume/CV (PDF, DOC, DOCX - Max 5MB) *</Label>
            <Input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, "resume")}
              className="mt-1"
            />
            {formData.resume ? (
              <p className="text-sm text-green-600 mt-1">✓ {formData.resume.name}</p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Please upload your resume or CV</p>
            )}
          </div>

          <div>
            <Label htmlFor="certificates">Academic Certificates (PDF, DOC, DOCX - Max 5MB)</Label>
            <Input
              id="certificates"
              name="certificates"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "certificates")}
              className="mt-1"
            />
            {formData.certificates && (
              <p className="text-sm text-green-600 mt-1">✓ {formData.certificates.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="otherDocuments">Other Documents (PDF, DOC, DOCX, Images - Max 5MB)</Label>
            <Input
              id="otherDocuments"
              name="otherDocuments"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "otherDocuments")}
              className="mt-1"
            />
            {formData.otherDocuments && (
              <p className="text-sm text-green-600 mt-1">✓ {formData.otherDocuments.name}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="coverLetter">Cover Letter / Why do you want to join us?</Label>
          <Textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            placeholder="Tell us about yourself and why you would be a great fit for Clevers' Origin Schools..."
            rows={4}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="references">Professional References</Label>
          <Textarea
            id="references"
            name="references"
            value={formData.references}
            onChange={handleInputChange}
            placeholder="Please provide names and contact details of 2-3 professional references..."
            rows={3}
            className="mt-1"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3"
      >
        {isSubmitting ? "Submitting Application..." : "Submit Application"}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        By submitting this application, you agree to our privacy policy and consent to us storing your information for recruitment purposes.
      </p>
    </form>
  );
};

export default CareerApplicationForm;
