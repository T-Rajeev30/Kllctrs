"use client";

import type { Event } from "@/types";
import EventCard from "../cards/EventCard";

interface Props {
  events: Event[];
  savedIds: string[];
  setSavedEventIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function EventSidebar({
  events,
  savedIds,
  setSavedEventIds,
}: Props) {
  return (
    <div className="w-[352px] h-[560px] overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSaved={savedIds.includes(event.id)}
            savedEventIds={savedIds}
            setSavedEventIds={setSavedEventIds}
          />
        ))}
      </div>
    </div>
  );
}
