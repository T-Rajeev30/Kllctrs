import type {
  StateOption,
  MonthOption,
  YearOption,
  ImportStatus,
} from "./types";

/**
 * Supported Upload File Types
 */
export const ACCEPTED_FILE_TYPES = [".html", ".htm"];

export const ACCEPTED_MIME_TYPES = [
  "text/html",
  "application/xhtml+xml",
];

/**
 * Maximum upload size (10 MB)
 */
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

/**
 * TCDB Base Configuration
 */
export const TCDB = {
  BASE_URL: "https://www.tcdb.com/CardShowCalendar.cfm",

  COUNTRY: "United States",

  VIEW: "Calendar",
};

/**
 * Months
 */
export const MONTHS: MonthOption[] = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

/**
 * Dynamic Years
 *
 * Previous
 * Current
 * Next 5
 */
const currentYear = new Date().getFullYear();

export const YEARS: YearOption[] = Array.from(
  { length: 7 },
  (_, index) => ({
    label: String(currentYear - 1 + index),
    value: currentYear - 1 + index,
  })
);

/**
 * US States
 */
export const US_STATES: StateOption[] = [
  { name: "Alabama", code: "AL" },
  { name: "Alaska", code: "AK" },
  { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" },
  { name: "California", code: "CA" },
  { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" },
  { name: "Delaware", code: "DE" },
  { name: "District of Columbia", code: "DC" },
  { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" },
  { name: "Hawaii", code: "HI" },
  { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" },
  { name: "Indiana", code: "IN" },
  { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" },
  { name: "Kentucky", code: "KY" },
  { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" },
  { name: "Maryland", code: "MD" },
  { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" },
  { name: "Minnesota", code: "MN" },
  { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" },
  { name: "Montana", code: "MT" },
  { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" },
  { name: "New Hampshire", code: "NH" },
  { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" },
  { name: "New York", code: "NY" },
  { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" },
  { name: "Ohio", code: "OH" },
  { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" },
  { name: "Pennsylvania", code: "PA" },
  { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" },
  { name: "South Dakota", code: "SD" },
  { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" },
  { name: "Utah", code: "UT" },
  { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" },
  { name: "Washington", code: "WA" },
  { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" },
  { name: "Wyoming", code: "WY" },
];

/**
 * Default Upload Status
 */
export const DEFAULT_STATUS: ImportStatus = {
  status: "idle",
  title: "Waiting for HTML Upload",
  description:
    "Generate a TCDB URL, download the HTML page, and upload it here to begin importing events.",
};