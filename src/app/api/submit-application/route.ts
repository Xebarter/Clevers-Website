import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { client } from "@/lib/sanity/client";

export async function POST(request: Request) {
  try {
    console.log("Received POST request to /api/submit-application");
    const formData = await request.json();
    console.log("Form data:", formData);

    // Validate required fields
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
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate unique application ID
    const applicationId = uuidv4();
    console.log("Generated applicationId:", applicationId);

    // Save to Sanity
    const application = {
      _type: "application",
      applicationId,
      studentName: formData.studentName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      gradeLevel: formData.gradeLevel,
      parentName: formData.parentName,
      relationship: formData.relationship,
      phone: formData.phone,
      email: formData.email,
      campus: formData.campus,
      boarding: formData.boarding,
      previousSchool: formData.previousSchool || "",
      specialNeeds: formData.specialNeeds || "",
      howHeard: formData.howHeard,
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    console.log("Saving application to Sanity:", application);

    const sanityResult = await client.create(application);
    console.log("Application saved to Sanity:", sanityResult);

    // Email sending skipped as per request
    console.log("Email sending skipped");

    return NextResponse.json(
      { message: "Application submitted successfully", applicationId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Failed to submit application", details: error.message },
      { status: 500 }
    );
  }
}