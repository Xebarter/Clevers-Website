import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Helper function to parse experience string to years
function parseExperienceYears(experience: string): number {
  switch (experience) {
    case "Fresh Graduate":
      return 0;
    case "1-2 Years":
      return 1;
    case "3-5 Years":
      return 3;
    case "5-10 Years":
      return 5;
    case "10+ Years":
      return 10;
    default:
      return 0;
  }
}

// Helper function to upload a file to Supabase Storage
async function uploadFile(
  supabase: ReturnType<typeof createClient>,
  file: File,
  fullName: string,
  folder: string
): Promise<string | null> {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (file.size > 5 * 1024 * 1024) {
    console.error(`File ${file.name} exceeds 5MB limit`);
    return null;
  }

  if (!allowedTypes.includes(file.type)) {
    console.error(`File ${file.name} has invalid type: ${file.type}`);
    return null;
  }

  const timestamp = Date.now();
  const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, "_");
  const fileExtension = file.name.split(".").pop();
  const fileName = `${folder}/${sanitizedName}_${timestamp}.${fileExtension}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("job-documents")
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error(`Error uploading ${folder}:`, uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("job-documents")
    .getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const position = formData.get("position") as string;
    const experience = formData.get("experience") as string;
    const education = formData.get("education") as string;
    const skills = formData.get("skills") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const references = formData.get("references") as string;
    const resume = formData.get("resume") as File | null;
    const certificates = formData.get("certificates") as File | null;
    const otherDocuments = formData.get("otherDocuments") as File | null;

    // Validate required fields
    if (!fullName || !email || !phone || !position || !experience || !education) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Validate resume is provided
    if (!resume || resume.size === 0) {
      return NextResponse.json(
        { error: "Resume/CV is required" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upload files
    let cvUrl: string | null = null;
    let certificatesUrl: string | null = null;
    let otherDocumentsUrl: string | null = null;

    if (resume && resume.size > 0) {
      cvUrl = await uploadFile(supabase, resume, fullName, "resumes");
    }

    if (certificates && certificates.size > 0) {
      certificatesUrl = await uploadFile(supabase, certificates, fullName, "certificates");
    }

    if (otherDocuments && otherDocuments.size > 0) {
      otherDocumentsUrl = await uploadFile(supabase, otherDocuments, fullName, "other-documents");
    }

    // Insert application into database
    const { data, error } = await supabase.from("job_applications").insert({
      full_name: fullName,
      email: email.toLowerCase().trim(),
      phone: phone,
      address: address || null,
      position_applied: position,
      experience_years: parseExperienceYears(experience),
      qualifications: education,
      skills: skills || null,
      cover_letter: coverLetter || null,
      references_info: references || null,
      cv_url: cvUrl,
      certificates_url: certificatesUrl,
      other_documents_url: otherDocumentsUrl,
      application_status: "pending",
    }).select().single();

    if (error) {
      console.error("Error saving application:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Failed to submit application: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Application submitted successfully",
        applicationId: data?.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
