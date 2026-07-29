"use client";

import { useEffect, useState } from "react";

import { AnalyticsResponse } from "@/types/analytics";

import DashboardHeader from "@/components/admin/analytics/DashboardHeader";
import DashboardSection from "@/components/admin/analytics/DashboardSection";
import SummaryCards from "@/components/admin/analytics/SummaryCards";
import LoadingDashboard from "@/components/admin/analytics/LoadingDashboard";
import EmptyDashboard from "@/components/admin/analytics/EmptyDashboard";

import TimelineChart from "@/components/admin/analytics/charts/TimelineChart";
import TopPagesChart from "@/components/admin/analytics/charts/TopPagesChart";
import CountryChart from "@/components/admin/analytics/charts/CountryChart";
import StateChart from "@/components/admin/analytics/charts/StateChart";
import CityChart from "@/components/admin/analytics/charts/CityChart";
import DateFilter, {
  DateRange,
} from "@/components/admin/analytics/filters/DateFilter";
export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>("30d");
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/admin/analytics?range=${range}`);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics.");
        }

        const analytics: AnalyticsResponse = await response.json();
        setData(analytics);
      } catch (error) {
        console.error("Analytics Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [range]);

  // Loading State
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <LoadingDashboard />
        </div>
      </main>
    );
  }

  // Error State
  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-red-200 bg-white px-8 py-6 shadow-sm">
          <p className="text-lg font-medium text-red-600">
            Failed to load analytics.
          </p>
        </div>
      </main>
    );
  }

  // Empty State
  const hasAnalytics =
    data.summary.totalViews > 0 ||
    data.timeline.length > 0 ||
    data.pages.length > 0 ||
    data.countries.length > 0 ||
    data.states.length > 0 ||
    data.cities.length > 0;

  if (!hasAnalytics) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <DashboardHeader />
          <EmptyDashboard />
        </div>
      </main>
    );
  }

  // Dashboard
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <DashboardHeader />

        <SummaryCards summary={data.summary} />

        <DashboardSection
          title="Traffic Overview"
          description="Daily visitor trend across KLLCTRS."
        >
          <TimelineChart data={data.timeline} />
        </DashboardSection>

        <div className="grid gap-8 xl:grid-cols-2">
          <DashboardSection title="Top Pages" description="Most visited pages.">
            <TopPagesChart data={data.pages} />
          </DashboardSection>

          <DashboardSection
            title="Top Countries"
            description="Visitor distribution by country."
          >
            <CountryChart data={data.countries} />
          </DashboardSection>

          <DashboardSection
            title="Top States"
            description="Visitor distribution by state."
          >
            <StateChart data={data.states} />
          </DashboardSection>

          <DashboardSection
            title="Top Cities"
            description="Visitor distribution by city."
          >
            <CityChart data={data.cities} />
          </DashboardSection>
        </div>
      </div>
    </main>
  );
}
