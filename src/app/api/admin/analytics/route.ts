/**
 * ------------------------------------------------------------
 * FILE: route.ts
 * PURPOSE:
 * Returns aggregated analytics data for the admin dashboard.
 * ------------------------------------------------------------
 */

import { NextResponse } from "next/server";

import {
  getAnalyticsSummary,
  getTopPages,
  getCountries,
  getStates,
  getCities,
  getTimeline,
} from "@/lib/analytics/queries";

import { AnalyticsResponse } from "@/types/analytics";

export async function GET() {
  try {
    // Run all database queries in parallel
    const [
      summary,
      pages,
      countries,
      states,
      cities,
      timeline,
    ] = await Promise.all([
      getAnalyticsSummary(),
      getTopPages(),
      getCountries(),
      getStates(),
      getCities(),
      getTimeline(),
    ]);

    const response: AnalyticsResponse = {
      summary,
      pages,
      countries,
      states,
      cities,
      timeline,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Analytics API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch analytics.",
      },
      {
        status: 500,
      }
    );
  }
}