import type { DatabaseEvent } from "../models/database-event";

export interface ValidationResult {
  valid: boolean;

  errors: string[];

  warnings: string[];

  info: string[];
}

function isValidUrl(url?: string): boolean {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidZip(zip?: string): boolean {
  if (!zip) return false;

  return /^\d{5}(-\d{4})?$/.test(zip);
}

function isValidCoordinate(value?: number): boolean {
  return typeof value === "number" && !Number.isNaN(value);
}

export function validateEvent(
  event: DatabaseEvent
): ValidationResult {

  const errors: string[] = [];

  const warnings: string[] = [];

  const info: string[] = [];

  //----------------------------------
  // Required Fields
  //----------------------------------

  if (!event.name.trim()) {
    errors.push("Missing event title.");
  }

  if (!event.slug.trim()) {
    errors.push("Missing slug.");
  }

  if (!event.date_start) {
    errors.push("Missing start date.");
  }

  if (!event.date_end) {
    errors.push("Missing end date.");
  }

  if (!event.venue_name.trim()) {
    errors.push("Missing venue name.");
  }

  if (!event.venue_address.trim()) {
    errors.push("Missing venue address.");
  }

  if (!event.city.trim()) {
    errors.push("Missing city.");
  }

  if (!event.state.trim()) {
    errors.push("Missing state.");
  }

  if (!event.country.trim()) {
    errors.push("Missing country.");
  }

  if (!event.source_event_id.trim()) {
    errors.push("Missing source event id.");
  }

  if (!event.source_url.trim()) {
    errors.push("Missing source url.");
  }

  //----------------------------------
  // ZIP Code
  //----------------------------------

  if (event.zip_code && !isValidZip(event.zip_code)) {
    warnings.push("ZIP code format looks invalid.");
  }

  //----------------------------------
  // Coordinates
  //----------------------------------

  const hasLat = isValidCoordinate(event.lat);
const hasLng = isValidCoordinate(event.lng);

if (!hasLat || !hasLng) {
    warnings.push(
        "Coordinates unavailable. Event may not appear on the map until geocoding succeeds."
    );
}

  //----------------------------------
  // Website
  //----------------------------------

  if (event.website && !isValidUrl(event.website)) {
    warnings.push("Website URL appears invalid.");
  }

  if (event.facebook && !isValidUrl(event.facebook)) {
    warnings.push("Facebook URL appears invalid.");
  }

  if (event.instagram && !isValidUrl(event.instagram)) {
    warnings.push("Instagram URL appears invalid.");
  }

  //----------------------------------
  // Description
  //----------------------------------

  if (!event.description) {
    info.push("Description not available.");
  }

  //----------------------------------
  // Organizer
  //----------------------------------

  if (!event.organizer_name) {
    info.push("Organizer not available.");
  }

  if (!event.organizer_email) {
    info.push("Organizer email not available.");
  }

  if (!event.organizer_phone) {
    info.push("Organizer phone not available.");
  }

  //----------------------------------
  // Notes
  //----------------------------------

  if (!event.notes) {
    info.push("Event notes not available.");
  }

  //----------------------------------
  // Links
  //----------------------------------

  if (!event.website && !event.facebook) {
    info.push("No external website available.");
  }

  //----------------------------------

  return {

    valid: errors.length === 0,

    errors,

    warnings,

    info,

  };

}