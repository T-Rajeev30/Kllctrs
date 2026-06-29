import type { ParsedCalendarEvent } from "../types";

export interface FetchResult {
  eventId: string;
  html: string;
}

export interface FetchFailure {
  eventId: string;
  reason: string;
}

export interface FetchManyResult {
  success: FetchResult[];
  failed: FetchFailure[];
}

export interface DetailFetcherOptions {
  concurrency?: number;
  delayMs?: number;
  timeoutMs?: number;
}

export class DetailFetcherService {
  private readonly concurrency: number;
  private readonly delayMs: number;
  private readonly timeoutMs: number;

  constructor(options: DetailFetcherOptions = {}) {
    this.concurrency = options.concurrency ?? 3;
    this.delayMs = options.delayMs ?? 750;
    this.timeoutMs = options.timeoutMs ?? 10000;
  }

  //------------------------------------------
  // Build URL
  //------------------------------------------

  buildUrl(eventId: string): string {
    return `https://www.tcdb.com/CardShows.cfm?MODE=VIEW&ID=${eventId}`;
  }

  //------------------------------------------
  // Fetch One
  //------------------------------------------

  async fetch(eventId: string): Promise<string> {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      const response = await fetch(
        this.buildUrl(eventId),
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      return await response.text();

    } finally {
      clearTimeout(timer);
    }
  }

  //------------------------------------------
  // Fetch Many
  //------------------------------------------

  async fetchMany(
    events: ParsedCalendarEvent[]
  ): Promise<FetchManyResult> {

    const success: FetchResult[] = [];

    const failed: FetchFailure[] = [];

    for (
      let i = 0;
      i < events.length;
      i += this.concurrency
    ) {

      const batch =
        events.slice(
          i,
          i + this.concurrency
        );

      const results =
        await Promise.allSettled(

          batch.map(async event => {

            const html =
              await this.fetch(
                event.eventId
              );

            return {

              eventId:
                event.eventId,

              html,

            };

          })

        );

      results.forEach((result, index) => {

        const event =
          batch[index];

        if (
          result.status === "fulfilled"
        ) {

          success.push(
            result.value
          );

        }

        else {

          failed.push({

            eventId:
              event.eventId,

            reason:
              result.reason?.message ??
              "Unknown error",

          });

        }

      });

      //----------------------------------
      // Delay between batches
      //----------------------------------

      if (
        i + this.concurrency <
        events.length
      ) {

        await this.sleep(
          this.delayMs
        );

      }

    }

    return {

      success,

      failed,

    };

  }

  //------------------------------------------

  private sleep(
    ms: number
  ): Promise<void> {

    return new Promise(resolve => {

      setTimeout(
        resolve,
        ms
      );

    });

  }

}