import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventDetailMap from "@/components/maps/map/EventsDetailMap";
import SaveButton from "@/components/auth/SaveButton";
import type { Shop } from "@/types";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Phone,
  ExternalLink,
  Navigation,
} from "lucide-react";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("shops")
    .select("name, city, state, specialty")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Shop Not Found | KLLCTRS" };

  const title = `${data.name} — ${data.city}, ${data.state} | KLLCTRS`;
  const description = `${data.name} is a card shop in ${data.city}, ${data.state}. Find sports cards, Pokémon, and more on KLLCTRS.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

const specialtyLabel: Record<string, string> = {
  sports: "Sports Cards",
  pokemon: "Pokémon",
  both: "Sports & Pokémon",
};

export default async function ShopDetailPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (!shop) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isSaved = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("saved_shops")
      .eq("id", user.id)
      .single();
    isSaved = ((profile?.saved_shops ?? []) as string[]).includes(shop.id);
  }

  const sh = shop as Shop;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: sh.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: sh.address ?? "",
      addressLocality: sh.city,
      addressRegion: sh.state,
      postalCode: sh.zip_code ?? "",
      addressCountry: "US",
    },
    ...(sh.lat &&
      sh.lng && {
        geo: { "@type": "GeoCoordinates", latitude: sh.lat, longitude: sh.lng },
      }),
    telephone: sh.phone ?? undefined,
    url: sh.website ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] pt-24">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
          <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
        </div>

        {/* Header */}
        <div className="relative z-10 border-b border-violet-100 bg-white/70 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/shops"
              className="inline-flex items-center gap-1.5 text-sm text-[#5f2eea] hover:text-[#4a1fa8] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Shops
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 border-b border-violet-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center text-xs font-medium bg-violet-50 text-[#5f2eea] border border-violet-200 px-2.5 py-1 rounded-full">
                    {sh.state}
                  </span>
                  {sh.specialty && (
                    <span className="inline-flex items-center text-xs font-medium bg-[#f4f3fb] text-[#4a3f6b]/60 border border-violet-100 px-2.5 py-1 rounded-full">
                      {specialtyLabel[sh.specialty] ?? sh.specialty}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-[#1a0a3d] tracking-tight mb-2">
                  {sh.name}
                </h1>
                <div className="flex items-center gap-1 text-[#4a3f6b]/50 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  {sh.city}, {sh.state}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="rounded-xl border border-violet-200 p-1.5 bg-white/80">
                  <SaveButton
                    eventId={sh.id}
                    initialSaved={isSaved}
                    type="shop"
                  />
                </div>
                {sh.website && (
                  <a
                    href={sh.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-black text-white border-0 shadow-lg shadow-violet-500/20"
                    style={{
                      background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
                    }}
                  >
                    Visit Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — map + address */}
            <div className="lg:col-span-2 space-y-6">
              {sh.lat && sh.lng ? (
                <div
                  className="rounded-2xl overflow-hidden border border-violet-100 shadow-xl shadow-violet-200/30"
                  style={{ height: "360px" }}
                >
                  <EventDetailMap lat={sh.lat} lng={sh.lng} name={sh.name} />
                </div>
              ) : (
                <div className="rounded-2xl border border-violet-100 bg-white/80 p-8 text-center">
                  <MapPin className="w-8 h-8 text-[#5f2eea]/20 mx-auto mb-2" />
                  <p className="text-sm text-[#4a3f6b]/40">
                    Location coordinates not available
                  </p>
                </div>
              )}

              {sh.address && (
                <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5">
                  <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-3">
                    Address
                  </h2>
                  <p className="text-sm text-[#4a3f6b]/70 leading-relaxed">
                    {sh.address}
                    {sh.zip_code && (
                      <>
                        <br />
                        {sh.zip_code}
                      </>
                    )}
                  </p>
                  {sh.lat && sh.lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${sh.lat},${sh.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#5f2eea] hover:text-[#4a1fa8] font-medium mt-3 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Open in Google Maps
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right — sidebar */}
            <div>
              <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5 sticky top-28">
                <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-4">
                  Quick Facts
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider mb-1">
                      Location
                    </div>
                    <div className="text-sm font-bold text-[#1a0a3d]">
                      {sh.city}, {sh.state}
                    </div>
                  </div>

                  {sh.specialty && (
                    <>
                      <div className="border-t border-violet-100" />
                      <div>
                        <div className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider mb-1">
                          Specialty
                        </div>
                        <div className="text-sm font-bold text-[#1a0a3d]">
                          {specialtyLabel[sh.specialty] ?? sh.specialty}
                        </div>
                      </div>
                    </>
                  )}

                  {sh.phone && (
                    <>
                      <div className="border-t border-violet-100" />
                      <div>
                        <div className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider mb-1">
                          Phone
                        </div>
                        <a
                          href={`tel:${sh.phone}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5f2eea] hover:text-[#4a1fa8] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" /> {sh.phone}
                        </a>
                      </div>
                    </>
                  )}

                  {sh.website && (
                    <>
                      <div className="border-t border-violet-100" />
                      <div>
                        <div className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider mb-1">
                          Website
                        </div>
                        <a
                          href={sh.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5f2eea] hover:text-[#4a1fa8] break-all transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          {sh.website
                            .replace(/^https?:\/\/(www\.)?/, "")
                            .replace(/\/$/, "")}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-6 text-center">
            <p className="text-sm text-[#4a3f6b]/40 mb-2">
              Looking for more shops?
            </p>
            <Link
              href="/shops"
              className="text-sm text-[#5f2eea] hover:text-[#4a1fa8] font-bold transition-colors"
            >
              Browse all card shops →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
