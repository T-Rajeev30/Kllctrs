"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  eventId: string;
  initialSaved: boolean;
  type?: "event" | "shop";
}

export default function SaveButton({
  eventId,
  initialSaved,
  type = "event",
}: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [, startTransition] = useTransition();

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const prev = saved;
    setSaved(!prev); // optimistic

    const endpoint =
      type === "event"
        ? `/api/events/${eventId}/save`
        : `/api/shops/${eventId}/save`;
    const res = await fetch(endpoint, { method: "POST" });

    if (!res.ok) {
      setSaved(prev); // revert
      if (res.status === 401) {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
      return;
    }

    const data = await res.json();
    setSaved(data.saved);
    startTransition(() => router.refresh());
  };

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-md hover:bg-accent transition-colors"
      aria-label={saved ? "Unsave" : "Save"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={saved ? "text-red-500" : "text-muted-foreground"}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
