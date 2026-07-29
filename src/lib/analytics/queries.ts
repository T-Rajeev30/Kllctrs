/**
 * ------------------------------------------------------------
 * FILE: queries.ts
 * PURPOSE:
 * All database queries used by the analytics dashboard.
 * ------------------------------------------------------------
 */

import { createClient } from "@supabase/supabase-js";
import { SummaryStats } from "@/types/analytics";
import { PageStat } from "@/types/analytics";
import { CountryStat } from "@/types/analytics";
import { StateStat } from "@/types/analytics";
import { CityStat } from "@/types/analytics";
import { TimelineStat } from "@/types/analytics";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export async function getAnalyticsSummary(): Promise<SummaryStats> {
  // Total page views
  const { count: totalViews, error: totalError } = await supabase
    .from("analytics_locations")
    .select("*", { count: "exact", head: true });

  if (totalError) throw totalError;

  // Fetch country/state/city columns
  const { data, error } = await supabase
    .from("analytics_locations")
    .select("country, state, city");

  if (error) throw error;

  const uniqueCountries = new Set(
    data.map((d) => d.country).filter(Boolean)
  ).size;

  const uniqueStates = new Set(
    data.map((d) => d.state).filter(Boolean)
  ).size;

  const uniqueCities = new Set(
    data.map((d) => d.city).filter(Boolean)
  ).size;

  return {
    totalViews: totalViews ?? 0,
    uniqueCountries,
    uniqueStates,
    uniqueCities,
  };
}

export async function getTopPages(): Promise<PageStat[]> {
  const { data, error } = await supabase
    .from("analytics_locations")
    .select("page");

  if (error) throw error;

  const counts = new Map<string, number>();

  data.forEach((row) => {
    counts.set(row.page, (counts.get(row.page) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([page, views]) => ({
      page,
      views,
    }))
    .sort((a, b) => b.views - a.views);
}


export async function getCountries(): Promise<CountryStat[]> {
  const { data, error } = await supabase
    .from("analytics_locations")
    .select("country");

  if (error) throw error;

  const counts = new Map<string, number>();

  data.forEach((row) => {
    if (!row.country) return;
    counts.set(row.country, (counts.get(row.country) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([country, views]) => ({
      country,
      views,
    }))
    .sort((a, b) => b.views - a.views);
}


export async function getStates(): Promise<StateStat[]> {
  const { data, error } = await supabase
    .from("analytics_locations")
    .select("state");

  if (error) throw error;

  const counts = new Map<string, number>();

  data.forEach((row) => {
    if (!row.state) return;
    counts.set(row.state, (counts.get(row.state) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([state, views]) => ({
      state,
      views,
    }))
    .sort((a, b) => b.views - a.views);
}


export async function getCities(): Promise<CityStat[]> {
  const { data, error } = await supabase
    .from("analytics_locations")
    .select("city");

  if (error) throw error;

  const counts = new Map<string, number>();

  data.forEach((row) => {
    if (!row.city) return;
    counts.set(row.city, (counts.get(row.city) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([city, views]) => ({
      city,
      views,
    }))
    .sort((a, b) => b.views - a.views);
}


export async function getTimeline(): Promise<TimelineStat[]> {
  const { data, error } = await supabase
    .from("analytics_locations")
    .select("visited_at");

  if (error) throw error;

  const counts = new Map<string, number>();

  data.forEach((row) => {
    const date = row.visited_at.split("T")[0];
    counts.set(date, (counts.get(date) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([date, views]) => ({
      date,
      views,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export type AnalyticsRange =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "year"
  | "all";

function getStartDate(range: AnalyticsRange): string | null {
  const date = new Date();

  switch (range) {
    case "today":
      date.setHours(0, 0, 0, 0);
      return date.toISOString();

    case "7d":
      date.setDate(date.getDate() - 7);
      return date.toISOString();

    case "30d":
      date.setDate(date.getDate() - 30);
      return date.toISOString();

    case "90d":
      date.setDate(date.getDate() - 90);
      return date.toISOString();

    case "year":
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
      return date.toISOString();

    case "all":
    default:
      return null;
  }
}

function analyticsQuery(range: AnalyticsRange) {
  const startDate = getStartDate(range);

  let query = supabase.from("analytics_locations");

  if (startDate) {
    query = query.gte("visited_at", startDate);
  }

  return query;
}