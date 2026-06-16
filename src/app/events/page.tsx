import { createClient } from "@/lib/supabase/server";
import EventsClient from "@/components/events/EventsClient";
import type { Event } from "@/types";

export const metadata = {
  title: "Card Shows & Events | KLLCTRS",
  description:
    "Find sports card shows, trade events, and conventions across the US. Interactive map with filters.",
};

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .order("date_start", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let savedIds: string[] = [];
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("saved_events")
      .eq("id", user.id)
      .single();
    savedIds = (profile?.saved_events ?? []) as string[];
  }

  return (
    <EventsClient
      initialEvents={(events ?? []) as Event[]}
      savedIds={savedIds}
    />
  );
}
