"use client";

import type { Event } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import SaveButton from "@/components/auth/SaveButton";

interface Props {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (event: Event) => void;
  savedIds: string[];
  isAuthed: boolean;
}

export default function EventList({
  events,
  selectedEvent,
  onEventSelect,
  savedIds,
  isAuthed,
}: Props) {
  if (events.length === 0) {
    return (
      <p className="text-muted-foreground">
        No shows found. Try adjusting filters.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div
          key={event.id}
          className={`rounded-xl border p-4 transition-all hover:border-primary relative ${
            selectedEvent?.id === event.id
              ? "border-primary bg-primary/5"
              : "border-border"
          }`}
        >
          <Link
            href={`/events/${event.slug}`}
            onClick={() => onEventSelect(event)}
            className="block"
          >
            <div className="flex justify-between items-start mb-2 pr-10">
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {event.state}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(event.date_start), "MMM d, yyyy")}
              </span>
            </div>
            <h3 className="font-medium text-sm mb-1 line-clamp-2 pr-8">
              {event.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {event.venue_name ? `${event.venue_name} · ` : ""}
              {event.city}, {event.state}
            </p>
            {event.vendor_tables && (
              <p className="text-xs text-muted-foreground mt-1">
                {event.vendor_tables} vendor tables
              </p>
            )}
          </Link>

          <div className="absolute top-3 right-3">
            <SaveButton
              eventId={event.id}
              initialSaved={savedIds.includes(event.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
