import type { DatabaseEvent } from "../models/database-event";

export interface SportsCollectorEvent {
  month: string;
  day: string;

  state: string;
  city: string;

  venue: string;
  address: string;

  showHours?: string;
  tables?: string;
  admission?: string;

  phone?: string;
  email?: string;
  website?: string;

  raw: string;
}

const MONTHS: Record<string, number> = {
  Jan: 1,
  January: 1,
  Feb: 2,
  February: 2,
  Mar: 3,
  March: 3,
  Apr: 4,
  April: 4,
  May: 5,
  Jun: 6,
  June: 6,
  Jul: 7,
  July: 7,
  Aug: 8,
  August: 8,
  Sep: 9,
  Sept: 9,
  September: 9,
  Oct: 10,
  October: 10,
  Nov: 11,
  November: 11,
  Dec: 12,
  December: 12,
};

function slugify(text?: string) {

  if (!text) {
    return crypto.randomUUID();
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}

function buildDate(
  month: string,
  day: string
) {
  const monthNumber =
    MONTHS[month];

  const year =
    new Date().getFullYear();

  const firstDay =
day.split(/[-–]/)[0];

  return `${year}-${String(monthNumber).padStart(2, "0")}-${String(Number(firstDay)).padStart(2, "0")}`;
}

export function normalizeSportsEvents(
  events: SportsCollectorEvent[]
): DatabaseEvent[] {

  return events

    //-----------------------------------------
    // Remove invalid events
    //-----------------------------------------
    .filter((event) => {

      return (
        event.month &&
        event.day &&
        event.state &&
        event.city &&
        event.venue
      );

    })

    //-----------------------------------------
    // Convert to DatabaseEvent
    //-----------------------------------------
    .map((event) => {

      const name =
        event.venue || event.raw;

      const date =
        buildDate(
          event.month,
          event.day
        );

      const tables =
        event.tables
          ? parseInt(
              event.tables.replace(/\D/g, ""),
              10
            )
          : undefined;

      return {

        //----------------------------------
        // Source
        //----------------------------------

        source_provider:
          "sportscollectorsdigest",

        source_event_id:
          crypto.randomUUID(),

        source_url:
          "https://sportscollectorsdigest.com/collecting-101/show-calendar",

        //----------------------------------
        // Event
        //----------------------------------

        name,

        slug:
          slugify(name),

        description:
          event.raw,

        //----------------------------------
        // Dates
        //----------------------------------

        date_start:
          date,

        date_end:
          date,

        //----------------------------------
        // Time
        //----------------------------------

        time_start:
          undefined,

        time_end:
          undefined,

        timezone:
          undefined,

        //----------------------------------
        // Venue
        //----------------------------------

        venue_name:
          event.venue,

        venue_address:
          event.address,

        city:
          event.city,

        state:
          event.state,

        zip_code:
          undefined,

        country:
          "United States",

        //----------------------------------
        // Coordinates
        //----------------------------------

        lat:
          undefined,

        lng:
          undefined,

        //----------------------------------
        // Links
        //----------------------------------

        website:
          event.website,

        facebook:
          undefined,

        instagram:
          undefined,

        //----------------------------------
        // Organizer
        //----------------------------------

        organizer_name:
          undefined,

        organizer_email:
          event.email,

        organizer_phone:
          event.phone,

        //----------------------------------
        // Event Info
        //----------------------------------

        admission:
          event.admission,

        tables,

        notes:
          event.raw,

        //----------------------------------
        // Metadata
        //----------------------------------

        imported_at:
          new Date().toISOString(),

        updated_at:
          new Date().toISOString(),

        last_verified_at:
          undefined,

        //----------------------------------
        // Status
        //----------------------------------

        active:
          true,

        published:
          false,

      };

    });

}