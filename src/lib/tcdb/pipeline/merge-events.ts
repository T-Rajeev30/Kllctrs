import type { ParsedCalendarEvent } from "../types";
import type { ParsedEventDetail } from "../parser/detail-parser";
import type { CompleteEvent } from "../models/event";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function mergeEvent(
  calendar: ParsedCalendarEvent,
  detail: ParsedEventDetail
): CompleteEvent {
  return {
    source: {
      provider: "tcdb",
      sourceId: calendar.eventId,
      sourceUrl: calendar.eventUrl,
      importedAt: new Date().toISOString(),
    },

    slug: slugify(detail.title || calendar.title),

    title: detail.title || calendar.title,

    description: detail.description,

    startDate: calendar.startDate,

    endDate: calendar.endDate,

    startTime: calendar.startTime,

    endTime: calendar.endTime,

    timezone: undefined,

    venue: {
      name: detail.venueName,

      address: detail.streetAddress,

      city: detail.city || calendar.city,

      state: detail.state || calendar.state,

      zipCode: detail.zipCode,

      country: detail.country,

      latitude: undefined,

      longitude: undefined,
    },

    links: {
      website: detail.website,
      facebook:
        detail.website?.includes("facebook")
          ? detail.website
          : undefined,
      instagram:
        detail.website?.includes("instagram")
          ? detail.website
          : undefined,
    },

    validation: {
      valid: false,
      warnings: [],
      errors: [],
    },
  };
}

export function mergeEvents(
  calendarEvents: ParsedCalendarEvent[],
  detailEvents: ParsedEventDetail[]
): CompleteEvent[] {
  const detailMap = new Map(
    detailEvents.map((event) => [event.eventId, event])
  );

  return calendarEvents
    .filter((calendar) => detailMap.has(calendar.eventId))
    .map((calendar) =>
      mergeEvent(calendar, detailMap.get(calendar.eventId)!)
    );
}