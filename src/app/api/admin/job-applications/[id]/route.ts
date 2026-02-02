import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabase/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Job application not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching job application:", error);
      return NextResponse.json(
        { error: "Failed to fetch job application" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in job application API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    // Remove any undefined or null values
    const updateData: Record<string, any> = {};
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    // Add reviewed_at timestamp if status is being updated
    if (updateData.application_status) {
      updateData.reviewed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("job_applications")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating job application:", error);
      return NextResponse.json(
        { error: "Failed to update job application" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in job application API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Delete the application directly
    const { data: deletedRows, error: deleteError } = await supabase
      .from("job_applications")
      .delete()
      .eq("id", id)
      .select();

    if (deleteError) {
      console.error("Error deleting job application:", deleteError);
      return NextResponse.json(
        { error: `Failed to delete job application: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // Check if any rows were actually deleted
    if (!deletedRows || deletedRows.length === 0) {
      console.error("No job application found with id:", id);
      return NextResponse.json(
        { error: "Job application not found or already deleted" },
        { status: 404 }
      );
    }

    console.log("Successfully deleted job application:", id);
    return NextResponse.json({ success: true, deletedId: id }, { status: 200 });
  } catch (error) {
    console.error("Error in job application API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
