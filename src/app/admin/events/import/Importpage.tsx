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

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-6 py-8">
      <ImportHeader />

      <UrlGenerator />

      <CalendarUploader onParsed={handleCalendarParsed} />

      <EventPreview events={events} detailPages={detailPages} />

      <DetailUploader
        detailPages={detailPages}
        onUploaded={handleDetailUploaded}
      />

      <ImportControlPanel
        calendarFile={calendarFile}
        detailFiles={detailFiles}
        events={events}
        detailPages={detailPages}
        onImported={setReport}
      />

      <ImportReport report={report} />
    </div>
  );
}
