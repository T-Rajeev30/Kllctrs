/**
 * ------------------------------------------------------------
 * FILE: locations.ts
 * PURPOSE:
 * Page and location analytics queries.
 * ------------------------------------------------------------
 */

import { supabase } from "./client";
import { AnalyticsRange, getStartDate } from "./utils";

import type {
  TopPage,
  CountryStat,
  StateStat,
  CityStat,
} from "@/types/analytics";

/* ----------------------------------------------------------
 * Top Pages
 * ---------------------------------------------------------- */

export async function getTopPages(
  range: AnalyticsRange = "30d"
): Promise<TopPage[]> {
  const startDate = getStartDate(range);

  let query = supabase
    .from("analytics_locations")
    .select("page");

  if (startDate) {
    query = query.gte("visited_at", startDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  const counts = new Map<string, number>();

  data?.forEach((row) => {
    if (!row.page) return;

    counts.set(
      row.page,
      (counts.get(row.page) ?? 0) + 1
    );
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([page, visits]) => ({
      page,
      visits,
    }));
}

/* ----------------------------------------------------------
 * Countries
 * ---------------------------------------------------------- */

export async function getCountries(
  range: AnalyticsRange = "30d"
): Promise<CountryStat[]> {
  const startDate = getStartDate(range);

  let query = supabase
    .from("analytics_locations")
    .select("country");

  if (startDate) {
    query = query.gte("visited_at", startDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  const counts = new Map<string, number>();

  data?.forEach((row) => {
    if (!row.country) return;

    counts.set(
      row.country,
      (counts.get(row.country) ?? 0) + 1
    );
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([country, visits]) => ({
      country,
      visits,
    }));
}

/* ----------------------------------------------------------
 * States
 * ---------------------------------------------------------- */

export async function getStates(
  range: AnalyticsRange = "30d"
): Promise<StateStat[]> {
  const startDate = getStartDate(range);

  let query = supabase
    .from("analytics_locations")
    .select("state");

  if (startDate) {
    query = query.gte("visited_at", startDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  const counts = new Map<string, number>();

  data?.forEach((row) => {
    if (!row.state) return;

    counts.set(
      row.state,
      (counts.get(row.state) ?? 0) + 1
    );
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([state, visits]) => ({
      state,
      visits,
    }));
}

/* ----------------------------------------------------------
 * Cities
 * ---------------------------------------------------------- */

export async function getCities(
  range: AnalyticsRange = "30d"
): Promise<CityStat[]> {
  const startDate = getStartDate(range);

  let query = supabase
    .from("analytics_locations")
    .select("city");

  if (startDate) {
    query = query.gte("visited_at", startDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  const counts = new Map<string, number>();

  data?.forEach((row) => {
    if (!row.city) return;

    counts.set(
      row.city,
      (counts.get(row.city) ?? 0) + 1
    );
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([city, visits]) => ({
      city,
      visits,
    }));
}