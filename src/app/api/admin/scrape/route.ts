// app/api/admin/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const STATE_NAMES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
  CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",
  HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",
  KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",
  MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",
  NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",
  NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
  OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
  SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",
  VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function makeUniqueSlug(base: string): string {
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

interface ScrapedEvent {
  name: string;
  date_start: string;
  date_end?: string;
  city: string;
  state: string;
  venue_name?: string;
  website?: string;
}

async function findEventsForState(stateCode: string): Promise<ScrapedEvent[]> {
  const stateName = STATE_NAMES[stateCode];
  const today = new Date().toISOString().split("T")[0];
  const threeMonths = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const prompt = `Search the web for upcoming trading card shows and sports card shows in ${stateName} between ${today} and ${threeMonths}.

Find as many events as possible from sources like CardShowFinder, TCDB, local promoter websites, Facebook events, and any other sources.

Return ONLY a JSON array with this exact format, no markdown, no explanation:
[
  {
    "name": "Event name",
    "date_start": "YYYY-MM-DD",
    "date_end": "YYYY-MM-DD",
    "city": "City name",
    "state": "${stateCode}",
    "venue_name": "Venue name or null",
    "website": "https://... or null"
  }
]

Rules:
- Only include events in ${stateName} (state code: ${stateCode})
- Only future events (after ${today})
- date_start and date_end must be YYYY-MM-DD format
- If single day event, date_end = date_start
- Return empty array [] if no events found
- Do not include Pokemon-only or Yu-Gi-Oh-only events unless they also have sports cards`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }] as any,
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
    });

    const text = response.text ?? "";
    const cleaned = text.replace(/```json\s?|```/g, "").trim();

    // Extract JSON array from response
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) return [];

    const events = JSON.parse(match[0]);
    if (!Array.isArray(events)) return [];

    // Validate and filter
    return events.filter((e: any) =>
      e.name && e.date_start && e.city && e.state &&
      e.date_start >= today &&
      /^\d{4}-\d{2}-\d{2}$/.test(e.date_start)
    );
  } catch (err) {
    console.error(`Gemini error for ${stateCode}:`, err);
    return [];
  }
}

export async function POST(req: NextRequest) {
  // Auth check — admin only
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminUser } = await supabaseAdmin.auth.admin.getUserById(user.id);
  if (adminUser?.user?.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const states: string[] = (body.states ?? US_STATES).filter((s: string) => US_STATES.includes(s));

  const results = {
    scraped: 0,
    inserted: 0,
    skipped: 0,
    errors: [] as string[],
    byState: {} as Record<string, number>,
  };

  for (const state of states) {
    try {
      const events = await findEventsForState(state);
      results.scraped += events.length;
      results.byState[state] = events.length;

      for (const event of events) {
        // Check duplicate
        const { data: existing } = await supabaseAdmin
          .from("events")
          .select("id")
          .eq("name", event.name)
          .eq("date_start", event.date_start)
          .eq("state", event.state)
          .maybeSingle();

        if (existing) {
          results.skipped++;
          continue;
        }

        const baseSlug = slugify(`${event.name} ${event.city} ${event.state}`);
        const slug = makeUniqueSlug(baseSlug);

        const { error } = await supabaseAdmin.from("events").insert({
          name: event.name,
          slug,
          date_start: event.date_start,
          date_end: event.date_end ?? event.date_start,
          city: event.city,
          state: event.state,
          venue_name: event.venue_name ?? null,
          website: event.website ?? null,
          status: "pending",
          source: "scraper",
        });

        if (error) {
          results.errors.push(`${event.name}: ${error.message}`);
        } else {
          results.inserted++;
        }
      }

      // Delay between states to avoid rate limiting
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err: any) {
      results.errors.push(`${state}: ${err.message}`);
    }
  }

  return NextResponse.json({
    success: true,
    ...results,
    message: `Found ${results.scraped} events across ${states.length} states. Inserted ${results.inserted} new, skipped ${results.skipped} duplicates.`,
  });
}