// /app/api/apply/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client"; // Ensure this is correctly initialized

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the body structure (optional, recommended)
    if (!body.student || !body.guardian || !body.academic || !body.campusPreference) {
      return NextResponse.json(
        { success: false, error: "Missing required application data" },
        { status: 400 }
      );
    }

    const doc = {
      _type: "application",
      student: body.student,
      guardian: body.guardian,
      academic: body.academic,
      campusPreference: body.campusPreference,
      additional: body.additional,
      termsAccepted: body.termsAccepted,
      submittedAt: new Date().toISOString(),
    };

    const result = await client.create(doc);

    return NextResponse.json({ success: true, id: result._id }, { status: 200 });
  } catch (error: any) {
    console.error("Error saving application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save application" },
      { status: 500 }
    );
  }
}
