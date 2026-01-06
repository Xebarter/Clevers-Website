import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabase/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Get application details
    const { data: application, error } = await getSupabaseAdmin()
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error retrieving application:", error);
      return NextResponse.json(
        {
          error: "Failed to retrieve application",
          details: error.message,
        },
        { status: 500 },
      );
    }

    if (!application) {
      console.error(`Application not found with ID: ${id}`);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Parse the message field to extract application metadata
    let parsedMessage: Record<string, unknown> = {};
    if (application.message) {
      try {
        parsedMessage = JSON.parse(application.message) as Record<string, unknown>;
      } catch (e) {
        console.warn("Could not parse application message:", e);
      }
    }

    // Combine the application data with parsed message data
    // Map the fields to match what the PDF generation expects
    return NextResponse.json({
      id: application.id,
      student_name: application.student_name || application.name,
      date_of_birth: application.date_of_birth,
      gender: application.gender,
      grade_level: application.grade_level,
      parent_name: application.parent_name,
      relationship: application.relationship || String(parsedMessage.relationship ?? ""),
      phone: application.phone,
      email: application.email,
      campus: application.campus,
      boarding: application.boarding,
      previous_school: application.previous_school || String(parsedMessage.previousSchool ?? ""),
      special_needs: application.special_needs || String(parsedMessage.specialNeeds ?? ""),
      how_heard: application.how_heard || String(parsedMessage.howHeard ?? ""),
      message: application.message,
      created_at: application.created_at,
      payment_status: application.payment_status || String(parsedMessage.paymentStatus ?? "pending"),
      application_status: application.application_status || application.status || 'pending',
    });
  } catch (error) {
    console.error("Error retrieving application:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to retrieve application", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}