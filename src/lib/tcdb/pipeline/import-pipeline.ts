import { parseCalendar } from "../parser/calender-parser";
import { parseEventDetail } from "../parser/detail-parser";

import { buildDatabaseEvent } from "./database-builder";

import { BatchImporterService } from "../services/batch-importer";

import type { BatchImportSummary } from "../services/batch-importer";
import type { ParsedCalendarEvent } from "../types";
import type { ParsedEventDetail } from "../parser/detail-parser";
import type { DatabaseEvent } from "../models/database-event";

export interface ImportPipelineInput {

  /**
   * Saved TCDB calendar HTML
   */
  calendarHtml: string;

  /**
   * Key = Event ID
   * Value = Saved Detail HTML
   */
  detailPages: Record<string, string>;

}

export interface ImportPipelineResult {

  calendarEvents: ParsedCalendarEvent[];

  detailEvents: ParsedEventDetail[];

  databaseEvents: DatabaseEvent[];

  report: BatchImportSummary;

}

export class ImportPipeline {

  constructor(

    private readonly batchImporter: BatchImporterService

  ) {}

  async execute(

    input: ImportPipelineInput

  ): Promise<ImportPipelineResult> {

    //--------------------------------------------------
    // Parse Calendar
    //--------------------------------------------------

    const calendarEvents =
      parseCalendar(
        input.calendarHtml
      );

    //--------------------------------------------------
    // Parse Detail Pages
    //--------------------------------------------------

    const detailEvents: ParsedEventDetail[] = [];

    for (const event of calendarEvents) {

      const html =
        input.detailPages[event.eventId];

      if (!html) {

        console.warn(
          `Missing detail page for ${event.eventId}`
        );

        continue;

      }

      const detail =
        parseEventDetail(html);

      detailEvents.push(detail);

    }

    //--------------------------------------------------
    // Merge
    //--------------------------------------------------

    const databaseEvents: DatabaseEvent[] = [];

    const detailMap =
      new Map(
        detailEvents.map(detail => [
          detail.eventId,
          detail,
        ])
      );

    for (const calendar of calendarEvents) {

      const detail =
        detailMap.get(
          calendar.eventId
        );

      if (!detail) {

        console.warn(
          `Skipping ${calendar.eventId}. Missing detail page.`
        );

        continue;

      }

      const event =
        buildDatabaseEvent(
          calendar,
          detail
        );

      databaseEvents.push(
        event
      );

    }

    //--------------------------------------------------
    // Import
    //--------------------------------------------------

    const report =
      await this.batchImporter.import(
        databaseEvents
      );

    //--------------------------------------------------

    return {

      calendarEvents,

      detailEvents,

      databaseEvents,

      report,

    };

  }

}