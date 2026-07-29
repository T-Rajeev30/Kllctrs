import type { DatabaseEvent } from "../../models/database-event";

export interface ParsedSportsEvent {

    month: string;

    day: string;

    state: string;

    city: string;

    venue?: string;

    address?: string;

    showHours?: string;

    tables?: string;

    admission?: string;

    phone?: string;

    email?: string;

    website?: string;

    raw: string;

}
const MONTHS: Record<string, number> = {

    Jan:1,
    January:1,

    Feb:2,
    February:2,

    Mar:3,
    March:3,

    Apr:4,
    April:4,

    May:5,

    Jun:6,
    June:6,

    Jul:7,
    July:7,

    Aug:8,
    August:8,

    Sep:9,
    September:9,

    Oct:10,
    October:10,

    Nov:11,
    November:11,

    Dec:12,
    December:12

};
function buildDate(
    month: string,
    day: string
) {

    const year =
        new Date().getFullYear();

    const monthNumber =
        MONTHS[month];

    const dayNumber =
        Number(
            day.split("-")[0]
        );

    return `${year}-${String(monthNumber).padStart(2,"0")}-${String(dayNumber).padStart(2,"0")}`;

}

function slugify(text: string) {

    return text
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

}

export function normalizeEvent(
    event: ParsedSportsEvent
): DatabaseEvent {

    const date =
        buildDate(
            event.month,
            event.day
        );

    return {

        source_provider: "sportscollectorsdigest",

        source_event_id:
            crypto.randomUUID(),

        source_url:
            "https://sportscollectorsdigest.com/collecting-101/show-calendar",

        name:
            event.venue ?? "Sports Card Show",

        slug:
            slugify(
                event.venue ?? "show"
            ),

        description:
            event.raw,

        date_start: date,

        date_end: date,

        time_start:
            event.showHours,

        time_end: undefined,

        timezone: undefined,

        venue_name:
            event.venue ?? "",

        venue_address:
            event.address ?? "",

        city:
            event.city,

        state:
            event.state,

        zip_code: undefined,

        country: "United States",

        lat: undefined,

        lng: undefined,

        website:
            event.website,

        facebook: undefined,

        instagram: undefined,

        organizer_name: undefined,

        organizer_email:
            event.email,

        organizer_phone:
            event.phone,

        admission:
            event.admission,

        tables:
            event.tables
                ? Number.parseInt(event.tables)
                : undefined,

        notes:
            event.raw,

        imported_at:
            new Date().toISOString(),

        updated_at:
            new Date().toISOString(),

        last_verified_at: undefined,

        active: true,

        published: false

    };

}