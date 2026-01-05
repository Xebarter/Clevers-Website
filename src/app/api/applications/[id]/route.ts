import { NextResponse } from "next/server";
import { applicationsService } from "../../../../../lib/supabase/services";

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
    const application = await applicationsService.getById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Parse the message field to extract application metadata
    let parsedMessage = {};
    if (application.message) {
      try {
        parsedMessage = JSON.parse(application.message);
      } catch (e) {
        console.warn("Could not parse application message:", e);
      }
    }

    // Return application data in a format suitable for PDF generation
    return NextResponse.json({
      id: application.id,
      name: application.name,
      date_of_birth: application.date_of_birth,
      gender: application.gender,
      grade_level: application.grade_level,
      parent_name: application.parent_name,
      relationship: parsedMessage.relationship || '',
      phone: application.phone,
      email: application.email,
      campus: application.campus,
      boarding: application.boarding,
      previous_school: application.previous_school,
      special_needs: application.special_needs,
      how_heard: parsedMessage.howHeard || '',
      message: application.message,
      created_at: application.created_at,
      payment_status: application.payment_status,
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