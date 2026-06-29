import type { DatabaseEvent } from "../models/database-event";

import { EventRepository } from "../repositories/event-repository";

import { DuplicateCheckerService } from "./duplicate-checker";
import { GeocoderService } from "./geocoder";

import { validateEvent } from "../pipeline/validator";
import { mapToSupabaseEvent } from "../pipeline/supabase-mapper";

export interface ImportResult {

  success: boolean;

  imported: boolean;

  duplicate: boolean;

  message: string;

  eventId?: string;

  validation?: ReturnType<typeof validateEvent>;

  event?: DatabaseEvent;

  error?: unknown;

}

export class ImporterService {

  constructor(

    private readonly repository: EventRepository,

    private readonly duplicateChecker: DuplicateCheckerService,

    private readonly geocoder: GeocoderService

  ) {}

  async import(

    event: DatabaseEvent

  ): Promise<ImportResult> {

    try {

        //---------------------------------------
        // Geocode
        //---------------------------------------
  
        const geocoded =
          await this.geocoder.geocode(event);
      //---------------------------------------
      // Validation
      //---------------------------------------

      const validation =
        validateEvent(event);

      if (!validation.valid) {

        return {

          success: false,

          imported: false,

          duplicate: false,

          message: "Validation failed.",

          validation,

          event,

        };

      }


      //---------------------------------------
      // Duplicate Check
      //---------------------------------------

      const duplicate =
        await this.duplicateChecker.check(
          geocoded
        );

      if (duplicate.duplicate) {

        return {

          success: true,

          imported: false,

          duplicate: true,

          message:
            duplicate.reason ??
            "Duplicate event.",

          validation,

          event: geocoded,

        };

      }

      //---------------------------------------
      // Map
      //---------------------------------------

      const row =
        mapToSupabaseEvent(
          geocoded
        );

      //---------------------------------------
      // Insert
      //---------------------------------------

      const inserted =
        await this.repository.create(
          row
        );

      //---------------------------------------

      return {

        success: true,

        imported: true,

        duplicate: false,

        message:
          "Event imported successfully.",

        validation,

        event: geocoded,

        eventId: inserted.id,

      };

    }

    catch (error) {
 
  return {
    success: false,
    imported: false,
    duplicate: false,
    message:
      error instanceof Error
        ? error.message
        : String(error),
    event,
    error,
  };
}

  }

  //---------------------------------------------------
  // Batch Import
  //---------------------------------------------------

  async importMany(

    events: DatabaseEvent[]

  ) {

    const results: ImportResult[] = [];

    for (const event of events) {

      const result =
        await this.import(event);

      results.push(result);

    }

    return {

      total: events.length,

      imported:
        results.filter(
          r => r.imported
        ).length,

      duplicates:
        results.filter(
          r => r.duplicate
        ).length,

      failed:
        results.filter(
          r => !r.success
        ).length,

      results,

    };

  }

}