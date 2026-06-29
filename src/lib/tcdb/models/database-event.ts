/**
 * Canonical database event model.
 *
 * This object maps directly to the Supabase `events` table.
 * Every stage of the ingestion pipeline should ultimately
 * produce this object before import.
 */

export interface DatabaseEvent {
  /**
   * Primary Key
   */
  id?: string;

  /**
   * Source Tracking
   */
  source_provider: "tcdb";

  source_event_id: string;

  source_url: string;

  /**
   * Event Information
   */
  name: string;

  slug: string;

  description?: string;

  /**
   * Dates
   */
  date_start: string;

  date_end: string;

  /**
   * Times
   */
  time_start?: string;

  time_end?: string;

  timezone?: string;

  /**
   * Venue
   */
  venue_name: string;

  venue_address: string;

  city: string;

  state: string;

  zip_code?: string;

  country: string;

  /**
   * Coordinates
   */
  lat?: number;

  lng?: number;

  /**
   * External Links
   */
  website?: string;

  facebook?: string;

  instagram?: string;

  /**
   * Organizer Information
   */
  organizer_name?: string;

  organizer_email?: string;

  organizer_phone?: string;

  /**
   * Event Metadata
   */
  admission?: string;

  tables?: number;

  notes?: string;

  /**
   * Import Metadata
   */
  imported_at: string;

  last_verified_at?: string;

  updated_at?: string;

  /**
   * Status
   */
  active: boolean;

  published: boolean;
}