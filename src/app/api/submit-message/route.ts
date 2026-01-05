import { NextResponse } from "next/server";
import { messagesService } from "../../../../lib/supabase/services";

export async function POST(request: Request) {
  try {
    console.log("Received POST request to /api/submit-message");
    const formData = await request.json();
    console.log("Form data:", formData);

    // Validate required fields
    const requiredFields = ["name", "email", "subject", "message"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Save to Supabase
    const messageData = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    };

    console.log("Saving message to Supabase:", messageData);

    const supabaseResult = await messagesService.create(messageData);
    console.log("Message saved to Supabase:", supabaseResult);

    return NextResponse.json(
      { message: "Message submitted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      { error: "Failed to submit message", details: error.message },
      { status: 500 }
    );
  }
}