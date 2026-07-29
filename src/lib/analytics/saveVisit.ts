/**
 * ------------------------------------------------------------
 * FILE: saveVisit.ts
 * PURPOSE:
 * Save analytics events into Supabase.
 * ------------------------------------------------------------
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AnalyticsVisit {
  page: string;
  referrer: string;
  country: string | null;
  state: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  ip: string | null;
  userAgent: string | null;
}

export async function saveVisit(data: AnalyticsVisit) {
  const { error } = await supabase
    .from("analytics_locations")
    .insert({
      page: data.page,
      referrer: data.referrer,

      country: data.country,
      state: data.state,
      city: data.city,

      latitude: data.latitude,
      longitude: data.longitude,

      ip: data.ip,
      user_agent: data.userAgent,
    });

  if (error) {
    console.error(error);
    throw error;
  }
}