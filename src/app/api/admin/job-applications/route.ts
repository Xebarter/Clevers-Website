import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  try {
    // Validate environment variables
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("job_applications")
      .select(`
        id,
        created_at,
        full_name,
        email,
        phone,
        address,
        position_applied,
        experience_years,
        qualifications,
        skills,
        cover_letter,
        references_info,
        cv_url,
        certificates_url,
        other_documents_url,
        application_status,
        reviewed_by,
        reviewed_at,
        notes
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching job applications:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Failed to fetch job applications: ${error.message}` },
        { status: 500 }
      );
    }

    console.log(`Fetched ${data?.length || 0} job applications`);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in job applications API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
