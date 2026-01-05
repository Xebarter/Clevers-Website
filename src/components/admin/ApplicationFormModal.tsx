"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar, User, Phone, Mail, School, Home, BookOpen } from "lucide-react";
import { createApplication, updateApplication } from "@/lib/admin/services";

const campuses = [
  { name: "Kitintale", options: ["Day", "Boarding"] },
  { name: "Kasokoso", options: ["Day"] },
  { name: "Maganjo", options: ["Day", "Boarding"] },
];

interface ApplicationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: any;
  onSave: () => void;
}

export default function ApplicationFormModal({ 
  open, 
  onOpenChange,
  application,
  onSave
}: ApplicationFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    gender: "",
    grade_level: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    email: "",
    phone: "",
    campus: "",
    boarding: "",
    previousSchool: "",
    specialNeeds: "",
    howHeard: "",
    relationship: "",
    status: "pending",
  });
  
  const [boardingOptions, setBoardingOptions] = useState<string[]>([]);

  useEffect(() => {
    if (application) {
      setFormData({
        name: application.studentName || application.name || "",
        date_of_birth: application.dateOfBirth || application.date_of_birth || "",
        gender: application.gender || "",
        grade_level: application.gradeLevel || application.grade_level || "",
        parent_name: application.parentName || application.parent_name || "",
        parent_email: application.email || application.parent_email || "",
        parent_phone: application.phone || application.parent_phone || "",
        email: application.email || "",
        phone: application.phone || "",
        campus: application.campus || "",
        boarding: application.boarding || "",
        previousSchool: application.previousSchool || "",
        specialNeeds: application.specialNeeds || "",
        howHeard: application.howHeard || application.how_heard || "",
        relationship: application.relationship || "",
        status: application.paymentStatus || application.status || "pending",
      });
      
      // Set boarding options based on campus
      if (application.campus) {
        const campus = campuses.find(c => c.name === application.campus);
        setBoardingOptions(campus?.options || []);
      }
    } else {
      // Reset form for new application
      setFormData({
        name: "",
        date_of_birth: "",
        gender: "",
        grade_level: "",
        parent_name: "",
        parent_email: "",
        parent_phone: "",
        email: "",
        phone: "",
        campus: "",
        boarding: "",
        previousSchool: "",
        specialNeeds: "",
        howHeard: "",
        relationship: "",
        status: "pending",
      });
      setBoardingOptions([]);
    }
  }, [application, open]);

  const handleChange = (id: string, value: string) => {
    if (id === "campus") {
      const selectedCampus = campuses.find((c) => c.name === value);
      setBoardingOptions(selectedCampus?.options || []);
      setFormData(prev => ({
        ...prev,
        [id]: value,
        boarding: "", // Reset boarding when campus changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (application) {
        // Update existing application
        await updateApplication(application._id, formData);
      } else {
        // Create new application
        // Generate a unique application ID
        const applicationData = {
          ...formData,
          message: JSON.stringify({
            applicationId: `APP-${Date.now()}`,
            howHeard: formData.howHeard,
            previousSchool: formData.previousSchool || null,
            specialNeeds: formData.specialNeeds || null,
            paymentStatus: formData.status,
            submittedAt: new Date().toISOString(),
          }),
        };
        await createApplication(applicationData);
      }
      
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving application:", error);
      alert(`Failed to ${application ? 'update' : 'create'} application`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {application ? "Edit Application" : "Create New Application"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-600 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange("date_of_birth", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grade_level">Grade Level *</Label>
                <Select value={formData.grade_level} onValueChange={(value) => handleChange("grade_level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nursery">Nursery</SelectItem>
                    <SelectItem value="kindergarten">Kindergarten</SelectItem>
                    <SelectItem value="p1">Primary 1</SelectItem>
                    <SelectItem value="p2">Primary 2</SelectItem>
                    <SelectItem value="p3">Primary 3</SelectItem>
                    <SelectItem value="p4">Primary 4</SelectItem>
                    <SelectItem value="p5">Primary 5</SelectItem>
                    <SelectItem value="p6">Primary 6</SelectItem>
                    <SelectItem value="p7">Primary 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-purple-600 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Parent/Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent_name">Full Name *</Label>
                <Input
                  id="parent_name"
                  value={formData.parent_name}
                  onChange={(e) => handleChange("parent_name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship *</Label>
                <Select value={formData.relationship} onValueChange={(value) => handleChange("relationship", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="parent_email">Parent Email *</Label>
                <Input
                  id="parent_email"
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => handleChange("parent_email", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Campus and Boarding Preference */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-green-600 flex items-center">
              <School className="h-5 w-5 mr-2" />
              Campus and Boarding Preference
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campus">Campus *</Label>
                <Select value={formData.campus} onValueChange={(value) => handleChange("campus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus.name} value={campus.name}>
                        {campus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="boarding">Boarding Preference *</Label>
                <Select 
                  value={formData.boarding} 
                  onValueChange={(value) => handleChange("boarding", value)}
                  disabled={!formData.campus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select boarding preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {boardingOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-amber-600 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Additional Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="previousSchool">Previous School</Label>
                <Input
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => handleChange("previousSchool", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="specialNeeds">Special Needs</Label>
                <Textarea
                  id="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={(e) => handleChange("specialNeeds", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="howHeard">How Did You Hear About Us? *</Label>
                <Select value={formData.howHeard} onValueChange={(value) => handleChange("howHeard", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">School Website</SelectItem>
                    <SelectItem value="referral">Friend/Family Referral</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="event">School Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Application Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select application status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {application ? "Update Application" : "Create Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}