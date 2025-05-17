// src/app/api/submit-application/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Basic validation
    const requiredFields = [
      "studentName",
      "dateOfBirth",
      "gender",
      "gradeLevel",
      "parentName",
      "relationship",
      "phone",
      "email",
      "campus",
      "boarding",
      "howHeard",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Log the form data (replace with database storage or email sending)
    console.log("Application received:", formData);

    // TODO: Add logic to store in database or send email
    // Example: Send email using Nodemailer (as in contact form) or save to Sanity

    return NextResponse.json(
      { message: "Application submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}