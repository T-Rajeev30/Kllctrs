/**
 * ------------------------------------------------------------
 * FILE: analytics.ts
 * PURPOSE:
 * Shared analytics interfaces.
 * ------------------------------------------------------------
 */

export interface SummaryStats {
  totalViews: number;
  uniqueCountries: number;
  uniqueStates: number;
  uniqueCities: number;
}

export interface CityStat {
  city: string;
  views: number;
}

export interface CountryStat {
  country: string;
  views: number;
}

export interface StateStat {
  state: string;
  views: number;
}

export interface PageStat {
  page: string;
  views: number;
}

export interface TimelineStat {
  date: string;
  views: number;
}

export interface AnalyticsResponse {
  summary: SummaryStats;
  pages: PageStat[];
  countries: CountryStat[];
  states: StateStat[];
  cities: CityStat[];
  timeline: TimelineStat[];
}