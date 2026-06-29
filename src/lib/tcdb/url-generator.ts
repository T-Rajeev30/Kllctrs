import type { CalendarSelection, StateOption } from "./types";
import { TCDB } from "./constants";

/**
 * Generates a TCDB Card Show Calendar URL.
 *
 * Example:
 * https://www.tcdb.com/CardShowCalendar.cfm?VIEW=Calendar&State=AL&Country=United%20States&Date=6-1-2026
 */
export function generateTcdbCalendarUrl(
  month: number,
  year: number,
  state: StateOption
): string {
  if (!state) {
    throw new Error("State is required.");
  }

  if (month < 1 || month > 12) {
    throw new Error("Invalid month.");
  }

  if (year < 2000) {
    throw new Error("Invalid year.");
  }

  const params = new URLSearchParams({
    VIEW: TCDB.VIEW,
    State: state.code,
    Country: TCDB.COUNTRY,
    Date: `${month}-1-${year}`,
  });

  return `${TCDB.BASE_URL}?${params.toString()}`;
}

/**
 * Generate URL directly from CalendarSelection
 */
export function generateUrlFromSelection(
  selection: CalendarSelection
): string {
  return generateTcdbCalendarUrl(
    selection.month,
    selection.year,
    selection.state
  );
}

/**
 * Validate a generated TCDB URL
 */
export function isValidTcdbUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    return (
      parsed.hostname === "www.tcdb.com" &&
      parsed.pathname === "/CardShowCalendar.cfm"
    );
  } catch {
    return false;
  }
}

/**
 * Open URL in new browser tab
 */
export function openTcdbUrl(url: string): void {
  if (!isValidTcdbUrl(url)) {
    throw new Error("Invalid TCDB URL.");
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Copy URL to clipboard
 */
export async function copyTcdbUrl(url: string): Promise<void> {
  if (!url) {
    throw new Error("Nothing to copy.");
  }

  await navigator.clipboard.writeText(url);
}

/**
 * Return Month Name
 */
export function getMonthName(month: number): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
  });

  return formatter.format(new Date(2026, month - 1, 1));
}

/**
 * Create default selection
 */
export function createDefaultSelection(
  state: StateOption
): CalendarSelection {
  const today = new Date();

  return {
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    state,
  };
}