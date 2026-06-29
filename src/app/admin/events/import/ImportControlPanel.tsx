"use client";

import { useMemo, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  UploadCloud,
} from "lucide-react";

import type { ParsedCalendarEvent } from "@/lib/tcdb/types";
import type { UploadedDetailPage } from "./DetailUploader";
import type { BatchImportSummary } from "@/lib/tcdb/services/batch-importer";

interface Props {
  calendarFile: File | null;
  detailFiles: File[];

  events: ParsedCalendarEvent[];

  detailPages: Record<string, UploadedDetailPage>;

  onImported: (report: BatchImportSummary) => void;
}

export default function ImportControlPanel({
  calendarFile,
  detailFiles,
  events,
  detailPages,
  onImported,
}: Props) {
  const [loading, setLoading] = useState(false);

  //------------------------------------------
  // Missing Detail Pages
  //------------------------------------------

  const missing = useMemo(() => {
    return events.filter((event) => !detailPages[event.eventId]);
  }, [events, detailPages]);

  //------------------------------------------

  const ready =
    events.length > 0 && missing.length === 0 && calendarFile !== null;

  //------------------------------------------

  async function importEvents() {
    if (!ready) return;

    try {
      setLoading(true);

      const formData = new FormData();

      //--------------------------------------
      // Calendar
      //--------------------------------------

      formData.append("calendar", calendarFile!);

      //--------------------------------------
      // Details
      //--------------------------------------

      for (const file of detailFiles) {
        formData.append("details", file);
      }

      //--------------------------------------

      const response = await fetch("/api/admin/events/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Import failed.");
      }

      const json = await response.json();

      onImported(json.report);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  //------------------------------------------

  return (
    <div className="rounded-xl border bg-background shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-semibold">Import Status</h2>
      </div>

      <div className="space-y-6 p-6">
        {/* Summary */}

        <div className="grid gap-4 md:grid-cols-4">
          <Stat title="Calendar Events" value={events.length} />

          <Stat title="Detail Pages" value={Object.keys(detailPages).length} />

          <Stat title="Missing" value={missing.length} />

          <Stat title="Ready" value={ready ? "YES" : "NO"} />
        </div>

        {/* Missing */}

        {missing.length > 0 && (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-700" />

              <span className="font-medium">Missing Detail Pages</span>
            </div>

            <div className="max-h-48 overflow-auto">
              {missing.map((event) => (
                <div key={event.eventId} className="py-1 text-sm">
                  {event.eventId}
                  {" · "}
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ready */}

        {ready && (
          <div className="rounded-lg border border-green-300 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Ready to import.
            </div>
          </div>
        )}

        {/* Button */}

        <button
          disabled={!ready || loading}
          onClick={importEvents}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Import Events
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface StatProps {
  title: string;

  value: string | number;
}

function Stat({
  title,

  value,
}: StatProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-xs uppercase text-muted-foreground">{title}</div>

      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
