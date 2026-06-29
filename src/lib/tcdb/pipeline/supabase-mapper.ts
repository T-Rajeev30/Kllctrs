import crypto from "crypto";

import type { DatabaseEvent } from "../models/database-event";
import type { EventInsertRow } from "../types/supabase";

/**
 * Creates a deterministic hash used for duplicate detection.
 */
function createDedupeHash(event: DatabaseEvent): string {
  return crypto
    .createHash("sha256")
    .update(
      [
        event.source_provider,
        event.source_event_id,
        event.name,
        event.date_start,
        event.date_end,
        event.city,
        event.state,
        event.venue_name,
      ].join("|")
    )
    .digest("hex");
}

/**
 * Builds the JSON object stored in social_links.
 */
function buildSocialLinks(
  event: DatabaseEvent
): Record<string, string> {
  const links: Record<string, string> = {};

  if (event.facebook) {
    links.facebook = event.facebook;
  }

  if (event.instagram) {
    links.instagram = event.instagram;
  }

  return links;
}

/**
 * Everything we don't currently model in the SQL schema.
 */
function buildMetadata(
  event: DatabaseEvent
): Record<string, unknown> {
  return {
    source: {
      provider: event.source_provider,
      event_id: event.source_event_id,
      url: event.source_url,
    },

    description: event.description,

    country: event.country,

    notes: event.notes,

    organizer: {
      name: event.organizer_name,
      email: event.organizer_email,
      phone: event.organizer_phone,
    },

    timezone: event.timezone,

    imported_at: event.imported_at,

    updated_at: event.updated_at,

    last_verified_at: event.last_verified_at,

    flags: {
      active: event.active,
      published: event.published,
    },
  };
}

/**
 * Converts our canonical DatabaseEvent into the
 * exact row expected by Supabase.
 */
export function mapToSupabaseEvent(
  event: DatabaseEvent
): EventInsertRow {

  return {

    //---------------------------------------
    // Event
    //---------------------------------------

    name: event.name,

    slug: event.slug,

    //---------------------------------------
    // Dates
    //---------------------------------------

    date_start: event.date_start,

    date_end: event.date_end,

    //---------------------------------------
    // Time
    //---------------------------------------

    time_start: event.time_start ?? null,

    time_end: event.time_end ?? null,

    //---------------------------------------
    // Location
    //---------------------------------------

    city: event.city,

    state: event.state,

    venue_name: event.venue_name,

    venue_address: event.venue_address ?? null,

    zip_code: event.zip_code ?? null,

    //---------------------------------------
    // Coordinates
    //---------------------------------------

    lat: event.lat ?? null,

    lng: event.lng ?? null,

    //---------------------------------------
    // Websites
    //---------------------------------------

    website: event.website ?? null,

    venue_website: null,

    //---------------------------------------
    // Vendors
    //---------------------------------------

    vendor_tables: event.tables ?? null,

    //---------------------------------------
    // Contact
    //---------------------------------------

    contact_name: event.organizer_name ?? null,

    contact_phone: event.organizer_phone ?? null,

    contact_email: event.organizer_email ?? null,

    //---------------------------------------
    // Guests
    //---------------------------------------

    autograph_guests: null,

    //---------------------------------------
    // Social
    //---------------------------------------

    social_links: buildSocialLinks(event),

    sponsors: null,

    //---------------------------------------
    // Source
    //---------------------------------------

    source: event.source_provider,

    //---------------------------------------
    // Status
    //---------------------------------------

    status: "pending",

    submitted_by: null,

    //---------------------------------------
    // Venue Relation
    //---------------------------------------

    venue_id: null,

    //---------------------------------------
    // Duplicate Detection
    //---------------------------------------

    dedupe_hash: createDedupeHash(event),

    //---------------------------------------
    // Metadata JSONB
    //---------------------------------------

    metadata: buildMetadata(event),

  };
}

/**
 * Maps multiple events.
 */
export function mapToSupabaseEvents(
  events: DatabaseEvent[]
): EventInsertRow[] {
  return events.map(mapToSupabaseEvent);
}
