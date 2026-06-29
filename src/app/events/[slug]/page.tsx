import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import EventDetailMap from "../../../components/maps/map/EventsDetailMap";
import SaveButton from "@/components/auth/SaveButton";
import type { Event } from "@/types";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("name, city, state, date_start, venue_name")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Event Not Found | KLLCTBLS" };

  const title = `${data.name} — ${data.city}, ${data.state} | KLLCTBLS`;
  const description = `${data.name} on ${format(new Date(data.date_start), "MMM d, yyyy")} at ${data.venue_name ?? data.city}. Find sports card shows on KLLCTBLS.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function EventDetailPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (!event) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isSaved = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("saved_events")
      .eq("id", user.id)
      .single();
    isSaved = ((profile?.saved_events ?? []) as string[]).includes(event.id);
  }

  const ev = event as Event;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.name,
    startDate: ev.date_start,
    endDate: ev.date_end ?? ev.date_start,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: ev.venue_name ?? `${ev.city}, ${ev.state}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: ev.venue_address ?? "",
        addressLocality: ev.city,
        addressRegion: ev.state,
        postalCode: ev.zip_code ?? "",
        addressCountry: "US",
      },
      ...(ev.lat &&
        ev.lng && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: ev.lat,
            longitude: ev.lng,
          },
        }),
    },
    organizer: ev.contact_name
      ? { "@type": "Person", name: ev.contact_name }
      : undefined,
    url: ev.website ?? undefined,
  };

  const dateRange =
    ev.date_end && ev.date_end !== ev.date_start
      ? `${format(new Date(ev.date_start), "MMM d")} – ${format(new Date(ev.date_end), "MMM d, yyyy")}`
      : format(new Date(ev.date_start), "MMMM d, yyyy");

  const daysUntil = Math.ceil(
    (new Date(ev.date_start).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero band */}
        <div className="border-b border-border bg-card/30">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Link
              href="/events"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6"
            >
              <span>←</span> All shows
            </Link>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {ev.state}
                  </span>
                  <span className="text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                    {dateRange}
                  </span>
                  {daysUntil > 0 && daysUntil <= 90 && (
                    <span className="text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full">
                      In {daysUntil} day{daysUntil === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-medium leading-tight mb-2">
                  {ev.name}
                </h1>
                <p className="text-muted-foreground">
                  {ev.venue_name && (
                    <span className="text-foreground">{ev.venue_name}</span>
                  )}
                  {ev.venue_name && " · "}
                  {ev.city}, {ev.state}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="rounded-md border border-border p-1">
                  <SaveButton eventId={ev.id} initialSaved={isSaved} />
                </div>

                {ev.website && (
                  <a
                    href={ev.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium inline-flex items-center"
                  >
                    Official site →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col — map + details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              {ev.lat && ev.lng ? (
                <div
                  className="rounded-xl overflow-hidden border border-border"
                  style={{ height: "360px" }}
                >
                  <EventDetailMap lat={ev.lat} lng={ev.lng} name={ev.name} />
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                  Location coordinates not available
                </div>
              )}

              {/* Venue card */}
              {(ev.venue_address || ev.venue_website) && (
                <div className="rounded-xl border border-border p-5">
                  <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Venue
                  </h2>
                  {ev.venue_name && (
                    <div className="font-medium mb-1">{ev.venue_name}</div>
                  )}
                  {ev.venue_address && (
                    <div className="text-sm text-muted-foreground">
                      {ev.venue_address}
                      {ev.zip_code && <>, {ev.zip_code}</>}
                    </div>
                  )}
                  {ev.venue_website && (
                    <a
                      href={ev.venue_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Venue website →
                    </a>
                  )}
                </div>
              )}

              {/* Autograph guests */}
              {ev.autograph_guests && (
                <div className="rounded-xl border border-border p-5">
                  <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Autograph Guests
                  </h2>
                  <p className="text-sm leading-relaxed">
                    {ev.autograph_guests}
                  </p>
                </div>
              )}

              {/* Sponsors */}
              {ev.sponsors && ev.sponsors.length > 0 && (
                <div className="rounded-xl border border-border p-5">
                  <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Sponsors
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {ev.sponsors.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-3 py-1.5 rounded-full bg-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right col — quick facts sidebar */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border p-5 sticky top-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                  Quick Facts
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Date
                    </div>
                    <div className="text-sm font-medium">{dateRange}</div>
                  </div>

                  <div className="border-t border-border" />

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Location
                    </div>
                    <div className="text-sm font-medium">
                      {ev.city}, {ev.state}
                    </div>
                  </div>

                  {ev.vendor_tables && (
                    <>
                      <div className="border-t border-border" />
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Vendor Tables
                        </div>
                        <div className="text-sm font-medium">
                          {ev.vendor_tables}
                        </div>
                      </div>
                    </>
                  )}

                  {ev.contact_name && (
                    <>
                      <div className="border-t border-border" />
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Contact
                        </div>
                        <div className="text-sm font-medium">
                          {ev.contact_name}
                        </div>
                        {ev.contact_phone && (
                          <a
                            href={`tel:${ev.contact_phone}`}
                            className="text-xs text-muted-foreground hover:text-foreground block mt-0.5"
                          >
                            {ev.contact_phone}
                          </a>
                        )}
                        {ev.contact_email && (
                          <a
                            href={`mailto:${ev.contact_email}`}
                            className="text-xs text-primary hover:underline block mt-0.5 break-all"
                          >
                            {ev.contact_email}
                          </a>
                        )}
                      </div>
                    </>
                  )}

                  {ev.social_links &&
                    Object.keys(ev.social_links).length > 0 && (
                      <>
                        <div className="border-t border-border" />
                        <div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Social
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(ev.social_links).map(
                              ([platform, url]) => (
                                <a
                                  key={platform}
                                  href={url as string}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs px-2.5 py-1 rounded-md border border-input hover:bg-accent capitalize"
                                >
                                  {platform}
                                </a>
                              ),
                            )}
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 rounded-xl border border-border p-6 bg-card/30 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Looking for more shows?
            </p>
            <Link
              href="/maps"
              className="text-sm text-primary hover:underline font-medium"
            >
              Browse all card shows →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
