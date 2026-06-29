import { NextRequest, NextResponse } from "next/server";

import { createImportPipeline } from "@/lib/tcdb/factory/create-import-pipeline";
import { parseEventDetail } from "@/lib/tcdb/parser/detail-parser";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest
) {

  try {

    //------------------------------------------------
// Authentication
//------------------------------------------------

const supabase = await createClient();

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}

const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (
  profile?.role !== "admin" &&
  profile?.role !== "super_admin"
) {
  return NextResponse.json(
    {
      success: false,
      error: "Forbidden",
    },
    {
      status: 403,
    }
  );
}
    //------------------------------------------------
    // Parse multipart form data
    //------------------------------------------------

    const formData =
      await request.formData();

    //------------------------------------------------
    // Calendar HTML
    //------------------------------------------------

    const calendarFile =
      formData.get(
        "calendar"
      ) as File | null;

    if (!calendarFile) {

      return NextResponse.json(

        {
          success: false,
          error:
            "Calendar HTML file is required.",
        },

        {
          status: 400,
        }

      );

    }

    //------------------------------------------------
    // Read calendar HTML
    //------------------------------------------------

    const calendarHtml =
      await calendarFile.text();

    //------------------------------------------------
    // Detail Files
    //------------------------------------------------

    const detailPages: Record<
      string,
      string
    > = {};

    const detailFiles =
      formData.getAll(
        "details"
      ) as File[];

    for (const file of detailFiles) {

  const html = await file.text();

  const detail = parseEventDetail(html);

  detailPages[detail.eventId] = html;

}

    //------------------------------------------------
    // Execute Pipeline
    //------------------------------------------------

    const pipeline =
      createImportPipeline();

    const result =
      await pipeline.execute({

        calendarHtml,

        detailPages,

      });

    //------------------------------------------------

    return NextResponse.json({

      success: true,

      report:
        result.report,

      calendarEvents:
        result.calendarEvents.length,

      detailEvents:
        result.detailEvents.length,

      databaseEvents:
        result.databaseEvents.length,

    });

  }

  catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown error.",

      },

      {

        status: 500,

      }

    );

  }

}