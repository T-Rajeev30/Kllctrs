export interface EventInsertRow {
  name: string;
  slug: string;

  date_start: string;
  date_end: string;

  city: string;
  state: string;

  venue_name: string;
  venue_address: string | null;
  zip_code: string | null;

  lat: number | null;
  lng: number | null;

  website: string | null;
  venue_website: string | null;

  vendor_tables: number | null;

  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;

  autograph_guests: string | null;

  social_links: Record<string, string>;

  sponsors: string[] | null;

  source: string;

  status: "pending" | "approved" | "rejected";

  submitted_by: string | null;

  venue_id: string | null;

  time_start: string | null;
  time_end: string | null;

  dedupe_hash: string;

  metadata: Record<string, unknown>;
}