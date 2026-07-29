import { NextRequest, NextResponse } from "next/server";
import { getVisitorLocation } from "@/lib/analytics/geo";
import { saveVisit } from "@/lib/analytics/saveVisit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Body:", body);

    const location = getVisitorLocation(request);

    console.log("Location:", location);

    await saveVisit({
      page: body.page,
      referrer: body.referrer,
      ...location,
    });

    console.log("Visit saved successfully");

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Analytics Error:", err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}