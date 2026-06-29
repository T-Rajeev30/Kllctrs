"use client";

import { useMemo, useState, useCallback } from "react";
import type { ParsedCalendarEvent } from "@/lib/tcdb/types";
import {
  Search,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Download,
  CalendarDays,
  MapPin,
  Link2,
} from "lucide-react";

import type { UploadedDetailPage } from "./DetailUploader";

interface EventPreviewProps {
  events: ParsedCalendarEvent[];
  detailPages: Record<string, UploadedDetailPage>;
}

type FilterMode = "all" | "downloaded" | "missing";

/* ---------------- Helpers ---------------- */

function copyToClipboard(text: string) {
  void navigator.clipboard?.writeText(text);
}

function staggerOpen(urls: string[]) {
  urls.forEach((url, i) => {
    setTimeout(
      () => window.open(url, "_blank", "noopener,noreferrer"),
      i * 300,
    );
  });
}

/* ---------------- Subcomponents ---------------- */

function StatisticCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-semibold ${accent ?? ""}`}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ downloaded }: { downloaded: boolean }) {
  return downloaded ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400">
      <CheckCircle2 className="h-3.5 w-3.5" /> Downloaded
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2.5 py-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
      <AlertTriangle className="h-3.5 w-3.5" /> Missing
    </span>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search title, city, state, ID…"
        aria-label="Search events"
        className="w-full rounded-xl border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/40"
      />
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
        active
          ? "bg-orange-500 text-white shadow-sm"
          : "border bg-background text-muted-foreground hover:bg-muted/60"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarButton({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: typeof Download;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function IconAction({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: typeof Copy;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition hover:bg-muted/60 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/40"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

/* ---------------- Main ---------------- */

export default function EventPreview({
  events,
  detailPages = {},
}: EventPreviewProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  const stats = useMemo(() => {
    const downloaded = events.filter((e) => detailPages[e.eventId]).length;
    return {
      total: events.length,
      downloaded,
      missing: events.length - downloaded,
      states: new Set(events.map((e) => e.state)).size,
      cities: new Set(events.map((e) => e.city)).size,
    };
  }, [events, detailPages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const isDownloaded = Boolean(detailPages[e.eventId]);
      if (filter === "downloaded" && !isDownloaded) return false;
      if (filter === "missing" && isDownloaded) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.state.toLowerCase().includes(q) ||
        e.eventId.toLowerCase().includes(q)
      );
    });
  }, [events, detailPages, query, filter]);

  const progress = useMemo(
    () =>
      stats.total === 0
        ? 0
        : Math.round((stats.downloaded / stats.total) * 100),
    [stats],
  );

  const openAll = useCallback(
    () => staggerOpen(events.map((e) => e.eventUrl)),
    [events],
  );
  const openMissing = useCallback(
    () =>
      staggerOpen(
        events.filter((e) => !detailPages[e.eventId]).map((e) => e.eventUrl),
      ),
    [events, detailPages],
  );
  const copyAll = useCallback(
    () => copyToClipboard(events.map((e) => e.eventUrl).join("\n")),
    [events],
  );

  if (events.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <CalendarDays className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No events yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Upload a TCDB calendar HTML file to preview events, track detail
            page downloads, and manage imports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatisticCard label="Total Events" value={stats.total} />
        <StatisticCard
          label="Downloaded"
          value={stats.downloaded}
          accent="text-green-600 dark:text-green-400"
        />
        <StatisticCard
          label="Missing"
          value={stats.missing}
          accent="text-yellow-600 dark:text-yellow-400"
        />
        <StatisticCard label="States" value={stats.states} />
        <StatisticCard label="Cities" value={stats.cities} />
        <StatisticCard label="Visible" value={filtered.length} />
      </div>

      {/* Progress */}
      <div className="rounded-xl border bg-background p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Detail Page Progress</span>
          <span className="text-muted-foreground">
            {stats.downloaded} / {stats.total}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={query} onChange={setQuery} />
          <div className="flex gap-2">
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </FilterButton>
            <FilterButton
              active={filter === "missing"}
              onClick={() => setFilter("missing")}
            >
              Missing
            </FilterButton>
            <FilterButton
              active={filter === "downloaded"}
              onClick={() => setFilter("downloaded")}
            >
              Downloaded
            </FilterButton>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ToolbarButton
            onClick={openAll}
            icon={ExternalLink}
            label="Open All"
          />
          <ToolbarButton
            onClick={openMissing}
            icon={Download}
            label="Open Missing"
          />
          <ToolbarButton onClick={copyAll} icon={Link2} label="Copy All URLs" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="sticky top-0 z-10 bg-muted/70 backdrop-blur">
              <tr>
                {[
                  "Date",
                  "Event",
                  "City",
                  "Time",
                  "Event ID",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((event) => {
                const downloaded = Boolean(detailPages[event.eventId]);
                return (
                  <tr
                    key={event.eventId}
                    className={`transition-colors ${
                      downloaded
                        ? "bg-green-500/5 hover:bg-green-500/10"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.startDate}
                          {event.endDate && event.endDate !== event.startDate
                            ? ` – ${event.endDate}`
                            : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {event.state}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {event.city}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                      {event.startTime || event.endTime
                        ? `${event.startTime ?? ""}${
                            event.endTime ? ` – ${event.endTime}` : ""
                          }`
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <code className="rounded bg-muted px-2 py-1 text-xs">
                        {event.eventId}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <StatusBadge downloaded={downloaded} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-2">
                        <IconAction
                          onClick={() =>
                            window.open(
                              event.eventUrl,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                          icon={ExternalLink}
                          label="Open detail page"
                        />
                        <IconAction
                          onClick={() => copyToClipboard(event.eventUrl)}
                          icon={Copy}
                          label="Copy URL"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      No events match your search or filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
