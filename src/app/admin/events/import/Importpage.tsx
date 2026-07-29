"use client";

import { useState, useCallback } from "react";

import type { ParsedCalendarEvent } from "@/lib/tcdb/types";
import type { BatchImportSummary } from "@/lib/tcdb/services/batch-importer";
import ImportHeader from "./ImportHeader";
import UrlGenerator from "./UrlGenerator";
import CalendarUploader from "./CalendarUploader";
import EventPreview from "./EventPreview";
import DetailUploader, { UploadedDetailPage } from "./DetailUploader";
import ImportControlPanel from "./ImportControlPanel";
import ImportReport from "./ImportReport";

export default function EventImportPage() {
  const [calendarFile, setCalendarFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<"tcdb" | "sportscollectorsdigest">(
    "tcdb",
  );
  const [events, setEvents] = useState<ParsedCalendarEvent[]>([]);

  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  const [detailPages, setDetailPages] = useState<
    Record<string, UploadedDetailPage>
  >({});

  const [report, setReport] = useState<BatchImportSummary | null>(null);

  // Merge new uploads into existing state — never replace.
  const handleDetailUploaded = useCallback(
    (files: File[], pages: Record<string, UploadedDetailPage>) => {
      setDetailFiles((prev) => {
        const seen = new Set(prev.map((f) => f.name));
        return [...prev, ...files.filter((f) => !seen.has(f.name))];
      });
      setDetailPages((prev) => ({ ...prev, ...pages }));
    },
    [],
  );

  const handleCalendarParsed = useCallback(
    (file: File, parsedEvents: ParsedCalendarEvent[]) => {
      setCalendarFile(file);
      setEvents(parsedEvents);
      // Reset detail state for a fresh calendar.
      setDetailFiles([]);
      setDetailPages({});
      setReport(null);
    },
    [],
  );
  const handleImported = useCallback((report: BatchImportSummary) => {
    setReport(report);
  }, []);

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-6 py-8">
      <ImportHeader />

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold">Event Provider</h3>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={provider === "tcdb"}
              onChange={() => setProvider("tcdb")}
            />
            TCDB Parser
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={provider === "sportscollectorsdigest"}
              onChange={() => setProvider("sportscollectorsdigest")}
            />
            Sports Collector Digest Scraper
          </label>
        </div>
      </div>

      {provider === "tcdb" && (
        <>
          <UrlGenerator />

          <CalendarUploader onParsed={handleCalendarParsed} />

          <EventPreview events={events} detailPages={detailPages} />

          <DetailUploader
            detailPages={detailPages}
            onUploaded={handleDetailUploaded}
          />
        </>
      )}

      {/* <UrlGenerator />

      <CalendarUploader onParsed={handleCalendarParsed} />

      <EventPreview events={events} detailPages={detailPages} />

      <DetailUploader
        detailPages={detailPages}
        onUploaded={handleDetailUploaded}
      /> */}

      {provider === "sportscollectorsdigest" && (
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Sports Collector Digest</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Events will be scraped directly from the website. No calendar HTML
            or detail pages are required.
          </p>
        </div>
      )}

      <ImportControlPanel
        provider={provider}
        calendarFile={calendarFile}
        detailFiles={detailFiles}
        events={events}
        detailPages={detailPages}
        onImported={handleImported}
      />

      <ImportReport report={report} />
    </div>
  );
}
