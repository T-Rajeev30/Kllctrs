import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import LogoutButton from "../../components/dashboard/LogoutButton";
import type { Event } from "@/types";

export const metadata = { title: "Dashboard | KLLCTBLS" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("saved_events")
    .eq("id", user.id)
    .single();

  const savedIds = (profile?.saved_events ?? []) as string[];
  let savedEvents: Event[] = [];
  if (savedIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("*")
      .in("id", savedIds)
      .eq("status", "approved")
      .order("date_start", { ascending: true });
    savedEvents = (data ?? []) as Event[];
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-medium mb-1">Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/preferences"
              className="h-9 px-4 rounded-md border border-input text-sm hover:bg-accent inline-flex items-center"
            >
              Preferences
            </Link>
            <LogoutButton />
          </div>
        </div>

        <section>
          <h2 className="text-xl font-medium mb-4">
            Saved Shows ({savedEvents.length})
          </h2>
          {savedEvents.length === 0 ? (
            <div className="rounded-xl border border-border p-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                No saved shows yet
              </p>
              <Link
                href="/events"
                className="text-sm text-primary hover:underline"
              >
                Browse shows →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedEvents.map((event) => (
                <Link
                  href={`/events/${event.slug}`}
                  key={event.id}
                  className="rounded-xl border border-border p-4 hover:border-primary transition-colors block"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {event.state}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(event.date_start), "MMM d, yyyy")}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{event.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {event.venue_name ? `${event.venue_name} · ` : ""}
                    {event.city}, {event.state}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
