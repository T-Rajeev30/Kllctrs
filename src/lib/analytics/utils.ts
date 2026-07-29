/**
 * ------------------------------------------------------------
 * FILE: utils.ts
 * PURPOSE:
 * Shared analytics utilities.
 * - Date range types
 * - Date filtering helper
 * ------------------------------------------------------------
 */

export type AnalyticsRange =
  | "today"
  | "7d"
  | "30d"
  | "90d"
  | "year"
  | "all";

/**
 * Returns the ISO timestamp representing the beginning
 * of the selected analytics range.
 *
 * Returning null means "no date filter".
 */
export function getStartDate(
  range: AnalyticsRange
): string | null {
  const now = new Date();

  switch (range) {
    case "today": {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      return date.toISOString();
    }

    case "7d": {
      const date = new Date(now);
      date.setDate(date.getDate() - 7);
      return date.toISOString();
    }

    case "30d": {
      const date = new Date(now);
      date.setDate(date.getDate() - 30);
      return date.toISOString();
    }

    case "90d": {
      const date = new Date(now);
      date.setDate(date.getDate() - 90);
      return date.toISOString();
    }

    case "year": {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - 1);
      return date.toISOString();
    }

    case "all":
    default:
      return null;
  }
}