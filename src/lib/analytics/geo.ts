/**
 * ------------------------------------------------------------
 * FILE: geo.ts
 * PURPOSE:
 * Extract visitor geolocation information from a Next.js request.
 * Uses Vercel's built-in geolocation helper.
 * ------------------------------------------------------------
 */

import { geolocation } from "@vercel/functions";
import { NextRequest } from "next/server";

export interface VisitorLocation {
  country: string | null;
  state: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  ip: string | null;
  userAgent: string | null;
}

export function getVisitorLocation(
  request: NextRequest
): VisitorLocation {
  const geo = geolocation(request);

  return {
    country: geo.country ?? null,
    state: geo.region ?? null,
    city: geo.city ?? null,

    latitude: geo.latitude
      ? Number(geo.latitude)
      : null,

    longitude: geo.longitude
      ? Number(geo.longitude)
      : null,

    ip:
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      null,

    userAgent:
      request.headers.get("user-agent") ??
      null,
  };
}