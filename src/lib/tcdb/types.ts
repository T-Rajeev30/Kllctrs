/**
 * TCDB Event Import System
 * Shared TypeScript Types
 */

export interface StateOption {
  name: string;
  code: string;
}

export interface MonthOption {
  label: string;
  value: number;
}

export interface YearOption {
  label: string;
  value: number;
}

/**
 * User selections from the Calendar Generator
 */
export interface CalendarSelection {
  month: number;
  year: number;
  state: StateOption;
}

/**
 * Generated TCDB Calendar URL
 */
export interface GeneratedCalendarUrl {
  url: string;
  generatedAt: Date;
}

/**
 * Uploaded HTML file information
 */
export interface UploadedHtmlFile {
  file: File | null;
  fileName: string;
  fileSize: number;
  uploadedAt?: Date;
}

/**
 * Upload Status
 */
export type UploadStatus =
  | "idle"
  | "selected"
  | "uploading"
  | "success"
  | "error";

/**
 * Import Status
 */
export interface ImportStatus {
  status: UploadStatus;
  title: string;
  description: string;
}

/**
 * Parsed Calendar Event
 * (Will be used in Phase 4)
 */
export interface ParsedCalendarEvent {
  id: string;

  title: string;

  eventUrl: string;

  eventId: string;

  city: string;

  state: string;

  startDate: string;

  endDate: string;

  startTime?: string;

  endTime?: string;
}

/**
 * Event Details
 * (Will be populated in later phases)
 */
export interface EventDetails {
  venue?: string;

  address?: string;

  zipCode?: string;

  website?: string;

  description?: string;

  admission?: string;

  dealerTables?: string;

  contact?: string;

  phone?: string;
}

/**
 * Complete Imported Event
 * (Final object before database import)
 */
export interface ImportedEvent
  extends ParsedCalendarEvent,
    EventDetails {
  latitude?: number;

  longitude?: number;

  slug?: string;
}

/**
 * URL Generator State
 */
export interface UrlGeneratorState {
  month: number;

  year: number;

  state: StateOption;

  generatedUrl: string;
}

/**
 * File Upload Component State
 */
export interface FileUploadState {
  selectedFile: UploadedHtmlFile;

  status: UploadStatus;

  error?: string;
}

/**
 * Generic Select Option
 */
export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}