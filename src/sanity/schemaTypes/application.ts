// /schemas/application.ts
import { defineField, defineType } from "sanity";

const studentInfo = defineType({
  name: "studentInfo",
  title: "Student Information",
  type: "object",
  fields: [
    defineField({ name: "firstName", type: "string", title: "First Name" }),
    defineField({ name: "lastName", type: "string", title: "Last Name" }),
    defineField({ name: "dateOfBirth", type: "string", title: "Date of Birth" }),
    defineField({ name: "gender", type: "string", title: "Gender" }),
    defineField({ name: "nationality", type: "string", title: "Nationality" }),
    defineField({ name: "religion", type: "string", title: "Religion" }),
  ],
});

const guardianInfo = defineType({
  name: "guardianInfo",
  title: "Guardian Information",
  type: "object",
  fields: [
    defineField({ name: "firstName", type: "string", title: "First Name" }),
    defineField({ name: "lastName", type: "string", title: "Last Name" }),
    defineField({ name: "relationship", type: "string", title: "Relationship" }),
    defineField({ name: "email", type: "string", title: "Email" }),
    defineField({ name: "phone", type: "string", title: "Phone" }),
    defineField({ name: "occupation", type: "string", title: "Occupation" }),
    defineField({ name: "address", type: "string", title: "Address" }),
  ],
});

const academicInfo = defineType({
  name: "academicInfo",
  title: "Academic Information",
  type: "object",
  fields: [
    defineField({ name: "appliedGrade", type: "string", title: "Applied Grade" }),
    defineField({ name: "previousSchool", type: "string", title: "Previous School" }),
    defineField({ name: "previousGrade", type: "string", title: "Previous Grade" }),
    defineField({ name: "academicRecords", type: "boolean", title: "Has Academic Records?" }),
  ],
});

const campusPreference = defineType({
  name: "campusPreference",
  title: "Campus Preference",
  type: "object",
  fields: [
    defineField({ name: "campus", type: "string", title: "Campus" }),
    defineField({ name: "admissionTerm", type: "string", title: "Admission Term" }),
    defineField({ name: "residentialOption", type: "string", title: "Residential Option" }),
  ],
});

const additionalInfo = defineType({
  name: "additionalInfo",
  title: "Additional Information",
  type: "object",
  fields: [
    defineField({ name: "specialNeeds", type: "boolean", title: "Special Needs?" }),
    defineField({ name: "specialNeedsDetails", type: "string", title: "Special Needs Details" }),
    defineField({ name: "healthConditions", type: "boolean", title: "Health Conditions?" }),
    defineField({ name: "healthConditionsDetails", type: "string", title: "Health Conditions Details" }),
    defineField({ name: "howDidYouHear", type: "string", title: "How Did You Hear About Us?" }),
    defineField({ name: "additionalComments", type: "string", title: "Additional Comments" }),
  ],
});

const application = defineType({
  name: "application",
  title: "Applications",
  type: "document",
  fields: [
    defineField({ name: "student", type: "studentInfo", title: "Student Information" }),
    defineField({ name: "guardian", type: "guardianInfo", title: "Guardian Information" }),
    defineField({ name: "academic", type: "academicInfo", title: "Academic Information" }),
    defineField({ name: "campusPreference", type: "campusPreference", title: "Campus Preference" }),
    defineField({ name: "additional", type: "additionalInfo", title: "Additional Information" }),
    defineField({
      name: "submittedAt",
      type: "datetime",
      title: "Submitted At",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});

export default [
  studentInfo,
  guardianInfo,
  academicInfo,
  campusPreference,
  additionalInfo,
  application,
];
