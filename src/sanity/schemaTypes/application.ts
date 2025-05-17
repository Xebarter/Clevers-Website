import { type SchemaTypeDefinition } from 'sanity';

const application: SchemaTypeDefinition = {
  name: "application",
  title: "Application",
  type: "document",
  fields: [
    {
      name: "applicationId",
      title: "Application ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "studentName",
      title: "Student Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "dateOfBirth",
      title: "Date of Birth",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "gender",
      title: "Gender",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "gradeLevel",
      title: "Grade Level",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "parentName",
      title: "Parent Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "relationship",
      title: "Relationship",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "campus",
      title: "Campus",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "boarding",
      title: "Boarding Preference",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "previousSchool",
      title: "Previous School",
      type: "string",
    },
    {
      name: "specialNeeds",
      title: "Special Needs",
      type: "string",
    },
    {
      name: "howHeard",
      title: "How Heard",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Completed", value: "completed" },
          { title: "Failed", value: "failed" },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: "pending",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    },
  ],
};

export default application;