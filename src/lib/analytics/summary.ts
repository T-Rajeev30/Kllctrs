/**
 * ------------------------------------------------------------
 * FILE: summary.ts
 * PURPOSE:
 * Analytics summary & timeline queries.
 * ------------------------------------------------------------
 */

import { supabase } from "./client";
import { AnalyticsRange, getStartDate } from "./utils";

import type {
  AnalyticsSummary,
  TimelinePoint,
} from "@/types/analytics";

/**
 * ------------------------------------------------------------
 * Dashboard Summary
 * ------------------------------------------------------------
 */

export async function getAnalyticsSummary(
  range: AnalyticsRange = "30d"
): Promise<AnalyticsSummary> {
  const startDate = getStartDate(range);

  let countQuery = supabase
    .from("analytics_locations")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (startDate) {
    countQuery = countQuery.gte("visited_at", startDate);
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    throw countError;
  }

  let locationQuery = supabase
    .from("analytics_locations")
    .select("country, state, city");

  if (startDate) {
    locationQuery = locationQuery.gte(
      "visited_at",
      startDate
    );
  }

  const {
    data: locations,
    error: locationError,
  } = await locationQuery;

  if (locationError) {
    throw locationError;
  }

  const uniqueCountries = new Set<string>();
  const uniqueStates = new Set<string>();
  const uniqueCities = new Set<string>();

  locations?.forEach((row) => {
    if (row.country) uniqueCountries.add(row.country);
    if (row.state) uniqueStates.add(row.state);
    if (row.city) uniqueCities.add(row.city);
  });

  return {
    totalVisits: count ?? 0,
    countries: uniqueCountries.size,
    states: uniqueStates.size,
    cities: uniqueCities.size,
  };
}

/**
 * ------------------------------------------------------------
 * Timeline
 * ------------------------------------------------------------
 */

export async function getTimeline(
  range: AnalyticsRange = "30d"
): Promise<TimelinePoint[]> {
  const startDate = getStartDate(range);

  let query = supabase
    .from("analytics_locations")
    .select("visited_at");

  if (startDate) {
    query = query.gte("visited_at", startDate);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const grouped = new Map<string, number>();

  data?.forEach((row) => {
    if (!row.visited_at) return;

    const day = row.visited_at.slice(0, 10);

    grouped.set(
      day,
      (grouped.get(day) ?? 0) + 1
    );
  });

  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, visits]) => ({
      date,
      visits,
    }));
}