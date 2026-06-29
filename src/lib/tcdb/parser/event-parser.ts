import type {
  ParsedCalendarEvent,
  ImportedEvent,
} from "../types";

/**
 * Mapping of US state codes to IANA timezones.
 * Used until venue-level timezone detection is added.
 */
const STATE_TIMEZONE: Record<string, string> = {
  AL: "America/Chicago",
  AK: "America/Anchorage",
  AZ: "America/Phoenix",
  AR: "America/Chicago",
  CA: "America/Los_Angeles",
  CO: "America/Denver",
  CT: "America/New_York",
  DE: "America/New_York",
  FL: "America/New_York",
  GA: "America/New_York",
  HI: "Pacific/Honolulu",
  IA: "America/Chicago",
  ID: "America/Denver",
  IL: "America/Chicago",
  IN: "America/Indiana/Indianapolis",
  KS: "America/Chicago",
  KY: "America/New_York",
  LA: "America/Chicago",
  MA: "America/New_York",
  MD: "America/New_York",
  ME: "America/New_York",
  MI: "America/Detroit",
  MN: "America/Chicago",
  MO: "America/Chicago",
  MS: "America/Chicago",
  MT: "America/Denver",
  NC: "America/New_York",
  ND: "America/Chicago",
  NE: "America/Chicago",
  NH: "America/New_York",
  NJ: "America/New_York",
  NM: "America/Denver",
  NV: "America/Los_Angeles",
  NY: "America/New_York",
  OH: "America/New_York",
  OK: "America/Chicago",
  OR: "America/Los_Angeles",
  PA: "America/New_York",
  RI: "America/New_York",
  SC: "America/New_York",
  SD: "America/Chicago",
  TN: "America/Chicago",
  TX: "America/Chicago",
  UT: "America/Denver",
  VA: "America/New_York",
  VT: "America/New_York",
  WA: "America/Los_Angeles",
  WI: "America/Chicago",
  WV: "America/New_York",
  WY: "America/Denver",
  DC: "America/New_York",
};

/**
 * Converts:
 * 9:00 AM
 * 12:30 PM
 *
 * into
 *
 * 09:00
 * 12:30
 */
function convertTimeTo24Hour(time?: string): string | undefined {
  if (!time) return undefined;

  const match = time.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (!match) return undefined;

  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, "0")}:${minute}`;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalize a parsed TCDB event
 * into the structure used by KLLCTRS.
 */
export function normalizeEvent(
  event: ParsedCalendarEvent
): ImportedEvent {
  return {
    ...event,

    slug: slugify(event.title),

    startTime: convertTimeTo24Hour(event.startTime),

    endTime: convertTimeTo24Hour(event.endTime),

    latitude: undefined,

    longitude: undefined,
  };
}

/**
 * Normalize an array of events.
 */
export function normalizeEvents(
  events: ParsedCalendarEvent[]
): ImportedEvent[] {
  return events.map(normalizeEvent);
}

/**
 * Returns timezone for a state.
 */
export function getTimezone(
  state: string
): string | undefined {
  return STATE_TIMEZONE[state];
}