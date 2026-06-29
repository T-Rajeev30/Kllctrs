"use client";

import { useState } from "react";

import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

import { parseCalendar } from "../../../../lib/tcdb/parser/calender-parser";
import type { ParsedCalendarEvent } from "@/lib/tcdb/types";

interface CalendarUploaderProps {
  onParsed: (file: File, events: ParsedCalendarEvent[]) => void;
}

export default function CalendarUploader({ onParsed }: CalendarUploaderProps) {
  const [fileName, setFileName] = useState("");
  const [eventCount, setEventCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const html = await file.text();

      const events = parseCalendar(html);

      setFileName(file.name);
      setEventCount(events.length);

      onParsed(file, events);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Unable to parse calendar.",
      );

      onParsed(file, []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <Upload className="h-5 w-5" />

        <h2 className="text-xl font-semibold">Upload Calendar HTML</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Upload the HTML file downloaded from the TCDB calendar page.
      </p>

      <input
        type="file"
        accept=".html,.htm"
        onChange={handleFile}
        className="block w-full rounded-lg border p-3"
      />

      {loading && (
        <div className="rounded-lg border bg-muted p-3">
          Parsing calendar...
        </div>
      )}

      {!loading && fileName && !error && (
        <div className="flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 p-4">
          <CheckCircle2 className="h-6 w-6 text-green-600" />

          <div>
            <div className="font-medium">Calendar Parsed Successfully</div>

            <div className="text-sm text-muted-foreground">
              <FileText className="mr-1 inline h-4 w-4" />

              {fileName}
            </div>

            <div className="mt-1 text-sm">
              <strong>{eventCount}</strong> event(s) found.
            </div>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4">
          <AlertCircle className="h-6 w-6 text-red-600" />

          <div>
            <div className="font-medium">Parsing Failed</div>

            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}
