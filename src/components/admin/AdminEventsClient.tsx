"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Event } from "@/types";
import {
  CalendarDays,
  MapPin,
  Globe,
  Mail,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  Loader2,
  Clock,
} from "lucide-react";

interface Props {
  initialEvents: Event[];
  currentStatus: string;
}

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const SOURCE_COLORS: Record<string, string> = {
  scraper: "bg-violet-50 text-[#5f2eea] border-violet-200",
  manual: "bg-[#f4f3fb] text-[#4a3f6b]/60 border-violet-100",
  user: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function AdminEventsClient({
  initialEvents,
  currentStatus,
}: Props) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [busy, setBusy] = useState<string | null>(null);

  const handleAction = async (
    id: string,
    action: "approve" | "reject" | "delete",
  ) => {
    setBusy(id);
    const res = await fetch(`/api/admin/events/${id}`, {
      method: action === "delete" ? "DELETE" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body:
        action === "delete"
          ? undefined
          : JSON.stringify({
              status: action === "approve" ? "approved" : "rejected",
            }),
    });
    setBusy(null);

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Action failed");
      return;
    }
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1a0a3d] tracking-tight">
          Events
        </h1>
        <p className="text-sm text-[#4a3f6b]/60 mt-1">
          {events.length} {currentStatus}{" "}
          {events.length === 1 ? "submission" : "submissions"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-violet-100">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`/admin/events?status=${t.value}`}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
              currentStatus === t.value
                ? "border-[#5f2eea] text-[#5f2eea]"
                : "border-transparent text-[#4a3f6b]/40 hover:text-[#1a0a3d]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {events.length === 0 ? (
        <div className="rounded-2xl border border-violet-100 bg-white/80 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-3">
            <CalendarDays className="w-5 h-5 text-[#5f2eea]/40" />
          </div>
          <p className="text-sm font-bold text-[#1a0a3d]">
            No {currentStatus} events
          </p>
          <p className="text-xs text-[#4a3f6b]/40 mt-1">
            {currentStatus === "pending"
              ? "All caught up! Nothing needs review."
              : "Nothing here yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-sm shadow-violet-200/20 p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Event info */}
                <div className="flex-1 min-w-0">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center text-xs font-semibold bg-[#5f2eea]/8 text-[#5f2eea] px-2.5 py-0.5 rounded-full">
                      {event.state}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#4a3f6b]/50">
                      <CalendarDays className="w-3 h-3" />
                      {format(new Date(event.date_start), "MMM d, yyyy")}
                      {event.date_end &&
                        event.date_end !== event.date_start &&
                        ` – ${format(new Date(event.date_end), "MMM d, yyyy")}`}
                    </span>
                    <span
                      className={`inline-flex items-center text-xs font-medium border px-2 py-0.5 rounded-full capitalize ${
                        SOURCE_COLORS[event.source ?? "manual"] ??
                        SOURCE_COLORS.manual
                      }`}
                    >
                      via {event.source ?? "manual"}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="font-black text-[#1a0a3d] text-base mb-1">
                    {event.name}
                  </h3>

                  {/* Location */}
                  <p className="text-sm text-[#4a3f6b]/60 flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5f2eea]/40 shrink-0" />
                    {event.venue_name && `${event.venue_name} · `}
                    {event.city}, {event.state}
                  </p>

                  {/* Contact */}
                  {event.contact_email && (
                    <p className="text-xs text-[#4a3f6b]/40 flex items-center gap-1.5 mb-1">
                      <Mail className="w-3 h-3 shrink-0" />
                      {event.contact_name ? `${event.contact_name} · ` : ""}
                      {event.contact_email}
                    </p>
                  )}

                  {/* Website */}
                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#5f2eea] hover:text-[#4a1fa8] inline-flex items-center gap-1 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      {event.website
                        .replace(/^https?:\/\/(www\.)?/, "")
                        .replace(/\/$/, "")}
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    target="_blank"
                    className="h-9 px-3 rounded-xl border border-violet-200 text-xs font-bold text-[#4a3f6b]/60 inline-flex items-center gap-1.5 hover:bg-violet-50 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> Review
                  </Link>

                  {currentStatus !== "approved" && (
                    <button
                      onClick={() => handleAction(event.id, "approve")}
                      disabled={busy === event.id}
                      className="h-9 px-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-black flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {busy === event.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      Approve
                    </button>
                  )}

                  {currentStatus !== "rejected" && (
                    <button
                      onClick={() => handleAction(event.id, "reject")}
                      disabled={busy === event.id}
                      className="h-9 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {busy === event.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm("Delete permanently? This cannot be undone."))
                        handleAction(event.id, "delete");
                    }}
                    disabled={busy === event.id}
                    className="h-9 px-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
