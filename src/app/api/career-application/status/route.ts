import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from("job_applications")
      .select("*")
      .eq("email", email.toLowerCase());

    // If an ID is provided, filter by that as well
    if (id) {
      query = query.eq("id", id);
    }

    // Get the most recent application if no ID specified
    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "No application found" },
          { status: 404 }
        );
      }
      console.error("Error fetching application:", error);
      return NextResponse.json(
        { error: "Failed to fetch application" },
        { status: 500 }
      );
    }

    // Return application data (excluding sensitive admin notes)
    const publicData = {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      position_applied: data.position_applied,
      experience_years: data.experience_years,
      qualifications: data.qualifications,
      skills: data.skills,
      cover_letter: data.cover_letter,
      references_info: data.references_info,
      cv_url: data.cv_url,
      certificates_url: data.certificates_url,
      other_documents_url: data.other_documents_url,
      application_status: data.application_status,
      created_at: data.created_at,
    };

    return NextResponse.json(publicData);
  } catch (error) {
    console.error("Error in application status API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
