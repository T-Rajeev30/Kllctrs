"use client";

import EventCard from "@/components/maps/cards/EventCard";
import type { Event } from "@/types";
import { useState } from "react";

interface Props {
  events?: Event[];
}

export default function SavedEvents({ events = [] }: Props) {
  const safeEvents = Array.isArray(events) ? events : [];

  const [savedEventIds, setSavedEventIds] = useState(
    safeEvents.map((e) => e.id),
  );
  if (safeEvents.length === 0) {
    return (
      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-bold">Saved Events</h2>

        <div className="rounded-3xl border border-dashed p-12 text-center text-zinc-500">
          No saved events yet.
        </div>
      </section>
    );
  }

  const visibleEvents = events.filter((event) =>
    savedEventIds.includes(event.id),
  );

  return (
    <section className="mt-10">
      <h2 className="mb-6 text-2xl font-bold">Saved Events</h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSaved={savedEventIds.includes(event.id)}
            savedEventIds={savedEventIds}
            setSavedEventIds={setSavedEventIds}
          />
        ))}
      </div>
    </section>
  );
}
