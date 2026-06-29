import type { DatabaseEvent } from "../models/database-event";
import { EventRepository } from "../repositories/event-repository";
import { mapToSupabaseEvent } from "../pipeline/supabase-mapper";

export interface DuplicateCheckResult {
  duplicate: boolean;

  reason?: string;

  existingEvent?: unknown;
}

export class DuplicateCheckerService {
  constructor(
    private readonly repository: EventRepository
  ) {}

  /**
   * Checks whether an event already exists.
   *
   * Priority:
   * 1. Source Provider + Source Event ID
   * 2. Dedupe Hash
   * 3. Slug + Start Date
   */
  async check(
    event: DatabaseEvent
  ): Promise<DuplicateCheckResult> {

    //--------------------------------------------------
    // Source Provider + Source Event ID
    //--------------------------------------------------

    const existingBySource =
      await this.repository.findBySourceId(
        event.source_provider,
        event.source_event_id
      );

    if (existingBySource) {
      return {
        duplicate: true,
        reason: "Event already exists (Source ID).",
        existingEvent: existingBySource,
      };
    }

    //--------------------------------------------------
    // Dedupe Hash
    //--------------------------------------------------

    const mapped =
      mapToSupabaseEvent(event);

    const existingByHash =
      await this.repository.findByHash(
        mapped.dedupe_hash
      );

    if (existingByHash) {
      return {
        duplicate: true,
        reason: "Duplicate event detected (Hash).",
        existingEvent: existingByHash,
      };
    }

    //--------------------------------------------------
    // Slug + Date
    //--------------------------------------------------

    const existingBySlug =
      await this.repository.findBySlugAndDate(
        event.slug,
        event.date_start
      );

    if (existingBySlug) {
      return {
        duplicate: true,
        reason: "Duplicate event detected (Slug + Date).",
        existingEvent: existingBySlug,
      };
    }

    //--------------------------------------------------

    return {
      duplicate: false,
    };
  }
}