"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import {
  Bookmark,
  BookmarkCheck,
  Globe,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/types";

interface Props {
  event: Event;
  isSaved: boolean;
  savedEventIds: string[];
  setSavedEventIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function EventCard({
  event,
  isSaved,
  savedEventIds,
  setSavedEventIds,
}: Props) {
  const supabase = createClient();

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      let updated: string[];

      // UNSAVE
      if (isSaved) {
        updated = savedEventIds.filter((id) => id !== event.id);

        const { error } = await supabase
          .from("profiles")
          .update({
            saved_events: updated,
          })
          .eq("id", user.id);

        if (error) {
          toast.error(error.message);
          return;
        }

        setSavedEventIds(updated);

        toast.success("Removed from Collection");

        return;
      }

      // SAVE
      updated = [...savedEventIds, event.id];

      const { error } = await supabase
        .from("profiles")
        .update({
          saved_events: updated,
        })
        .eq("id", user.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      setSavedEventIds(updated);

      toast.success("Added to Collection ✨", {
        description: event.name,
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-[10px] border border-[#F2EFFE] bg-[#FEF9FF]">
      {/* TOP */}
      <div className="flex h-[152px]">
        <div className="flex-1 border-r border-[#F2EFFE] px-4 py-3">
          <div className="mb-3 flex gap-2">
            <span className="rounded-full border border-[#FCDB9F] bg-[#F0C040] px-3 py-1 text-[11px] text-[#FDEFCE]">
              Upcoming
            </span>

            <span className="rounded-full border border-[#CBBEFB] bg-[#E5DFFD] px-3 py-1 text-[11px] text-[#8B5CF6]">
              {event.state}
            </span>
          </div>

          <h3 className="line-clamp-1 text-[20px] font-medium leading-[26px]">
            {event.name}
          </h3>

          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[#8B5CF6]">
            <MapPin size={14} />

            <span>
              {event.venue_name
                ? `${event.venue_name}, ${event.state}`
                : `${event.city}, ${event.state}`}
            </span>
          </div>

          <p className="mt-4 line-clamp-2 text-[10px] leading-[12px] text-black">
            {event.vendor_tables
              ? `${event.vendor_tables} vendor tables available.`
              : "Trading cards, vendors, collector meetups and hobby activities."}
          </p>
        </div>

        <div className="flex w-[105px] flex-col items-center justify-center px-3">
          <CalendarDays size={14} className="mb-2" />

          <div className="text-[16px] font-medium">
            {format(new Date(event.date_start), "dd MMM")}
          </div>

          <div className="my-2 flex w-full items-center gap-2">
            <div className="flex-1 border-t border-[#CBBEFB]" />

            <span className="text-[11px]">to</span>

            <div className="flex-1 border-t border-[#CBBEFB]" />
          </div>

          <div className="text-[16px] font-medium">
            {event.date_end
              ? format(new Date(event.date_end), "dd MMM")
              : format(new Date(event.date_start), "dd MMM")}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex h-[39px]">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex flex-1 items-center justify-center gap-2 rounded-bl-[10px] border border-[#F2EFFE] text-[12px] font-medium transition ${
            isSaved
              ? "bg-violet-50 text-violet-700"
              : "text-[#8B5CF6] hover:bg-[#F8F5FF]"
          }`}
        >
          {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}

          {saving ? "Saving..." : isSaved ? "Saved" : "Save"}
        </button>

        <Link
          href={`/events/${event.slug}`}
          className="flex flex-1 items-center justify-center border-y border-[#F2EFFE] text-[12px] font-medium text-[#8B5CF6]"
        >
          Details
        </Link>

        <a
          href={event.website ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-br-[10px] border border-[#F2EFFE] text-[12px] font-medium text-[#8B5CF6]"
        >
          <Globe size={13} />
          Web
        </a>
      </div>
    </div>
  );
}
