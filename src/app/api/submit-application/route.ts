import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { applicationsService, type Application } from "../../../../lib/supabase/services";

const applicationSchema = z.object({
  studentName: z.string().trim().min(1, "Student name is required"),
  dateOfBirth: z.string().trim().min(1, "Date of birth is required"),
  gender: z.string().trim().min(1, "Gender is required"),
  gradeLevel: z.string().trim().min(1, "Grade level is required"),
  parentName: z.string().trim().min(1, "Parent/guardian name is required"),
  relationship: z.string().trim().min(1, "Relationship is required"),
  phone: z.string().trim().min(7, "Phone number is required"),
  email: z.string().trim().email("Please provide a valid email address"),
  campus: z.string().trim().min(1, "Campus is required"),
  boarding: z.string().trim().min(1, "Boarding preference is required"),
  howHeard: z.string().trim().min(1, "Please let us know how you heard about us"),
  previousSchool: z.string().trim().optional(),
  specialNeeds: z.string().trim().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

type NewApplication = Omit<Application, "id" | "created_at">;

interface ApplicationMetadata {
  applicationId: string;
  relationship: string;
  previousSchool: string | null;
  specialNeeds: string | null;
  howHeard: string;
  paymentStatus: "pending" | "completed" | "failed";
  submittedAt: string;
}

const buildSupabasePayload = (
  data: ApplicationFormData,
  metadata: ApplicationMetadata,
): NewApplication => ({
  name: data.studentName,
  email: data.email,
  phone: data.phone,
  date_of_birth: data.dateOfBirth,
  gender: data.gender,
  address: "",
  grade_level: data.gradeLevel,
  parent_name: data.parentName,
  parent_email: data.email,
  parent_phone: data.phone,
  message: JSON.stringify(metadata),
  status: "pending",
  campus: data.campus,
  boarding: data.boarding,
});

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (server-side service role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    // Build metadata and payload then insert into the database
    const metadata: ApplicationMetadata = {
      applicationId: randomUUID(),
      relationship: applicationData.relationship,
      previousSchool: applicationData.previousSchool ?? null,
      specialNeeds: applicationData.specialNeeds ?? null,
      howHeard: applicationData.howHeard,
      paymentStatus: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const payload = buildSupabasePayload(applicationData, metadata);

    const { data, error } = await supabase
      .from('applications')
      .insert([payload])
      .select('id'); // Return the id of the inserted application

    if (error) {
      console.error('Error inserting application:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to submit application',
          details: error
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the application ID from the response
    const applicationId = data && data[0] ? data[0].id : null;

    if (!applicationId) {
      return new Response(
        JSON.stringify({ error: 'Failed to get application ID' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Application submitted successfully!',
        applicationId,
        metadata: {
          submittedAt: new Date().toISOString(),
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
