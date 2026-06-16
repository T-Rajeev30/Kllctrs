import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import { ArrowLeft, Globe, Eye, Trophy, ExternalLink } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  platinum: "bg-slate-100 text-slate-700 border border-slate-300",
  gold: "bg-amber-50 text-amber-700 border border-amber-200",
  silver: "bg-gray-100 text-gray-600 border border-gray-300",
  bronze: "bg-orange-50 text-orange-700 border border-orange-200",
};

const CATEGORY_LABELS: Record<string, string> = {
  grading: "Grading",
  grading_company: "Grading",
  auction: "Auctions",
  card_manufacturer: "Manufacturer",
  manufacturer: "Manufacturer",
  marketplace: "Marketplaces",
  hobby_retailer: "Retailer",
  breaker: "Breakers",
  shop: "Shops",
  software: "Software",
  media: "Media",
  technology: "Technology",
  other: "Other",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sponsors")
    .select("name, description")
    .eq("slug", slug)
    .single();
  return {
    title: data ? `${data.name} | KLLCTRS Sponsors` : "Sponsor | KLLCTRS",
    description: data?.description ?? "",
  };
}

export default async function SponsorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: sponsor } = await supabase
    .from("sponsors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!sponsor) notFound();

  // Increment view count (fire-and-forget, admin client bypasses RLS)
  supabaseAdmin
    .from("sponsors")
    .update({ profile_views: (sponsor.profile_views ?? 0) + 1 })
    .eq("id", sponsor.id)
    .then(() => {});

  const showsCount = sponsor.shows_sponsored?.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] pt-24">
      {/* Background ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-violet-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/sponsors"
            className="inline-flex items-center gap-1.5 text-sm text-[#5f2eea] hover:text-[#4a1fa8] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Sponsors
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Main Card */}
        <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center text-xs font-medium bg-violet-50 text-[#5f2eea] border border-violet-200 px-2.5 py-1 rounded-full">
              {CATEGORY_LABELS[sponsor.category] ?? "Other"}
            </span>
            {sponsor.tier && (
              <span
                className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                  TIER_COLORS[sponsor.tier] ?? TIER_COLORS.silver
                }`}
              >
                {sponsor.tier}
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-3xl sm:text-4xl font-black text-[#1a0a3d] tracking-tight mb-3">
            {sponsor.name}
          </h1>

          {/* Description */}
          {sponsor.description && (
            <p className="text-[#4a3f6b]/70 text-base leading-relaxed max-w-2xl mb-6">
              {sponsor.description}
            </p>
          )}

          {/* CTA */}
          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-black text-white border-0 shadow-xl shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
              style={{
                background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
              }}
            >
              <Globe className="w-4 h-4" />
              Visit Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {showsCount > 0 && (
            <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#5f2eea]/8 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-5 h-5 text-[#5f2eea]" />
              </div>
              <p className="text-2xl font-black text-[#5f2eea]">{showsCount}</p>
              <p className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider mt-0.5">
                Shows Sponsored
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#5f2eea]/8 flex items-center justify-center mx-auto mb-2">
              <Eye className="w-5 h-5 text-[#5f2eea]" />
            </div>
            <p className="text-2xl font-black text-[#5f2eea]">
              {(sponsor.profile_views ?? 0) + 1}
            </p>
            <p className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider mt-0.5">
              Profile Views
            </p>
          </div>

          {sponsor.website && (
            <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#5f2eea]/8 flex items-center justify-center mx-auto mb-2">
                <Globe className="w-5 h-5 text-[#5f2eea]" />
              </div>
              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#5f2eea] hover:text-[#4a1fa8] transition-colors truncate block"
              >
                {sponsor.website
                  .replace(/^https?:\/\/(www\.)?/, "")
                  .replace(/\/$/, "")}
              </a>
              <p className="text-[10px] font-medium text-[#4a3f6b]/40 uppercase tracking-wider mt-0.5">
                Website
              </p>
            </div>
          )}
        </div>

        {/* Sponsored Shows */}
        {sponsor.shows_sponsored && sponsor.shows_sponsored.length > 0 && (
          <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6">
            <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-4">
              Sponsored Shows
            </h2>
            <div className="flex flex-wrap gap-2">
              {sponsor.shows_sponsored.map((show: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center text-sm font-medium bg-[#f4f3fb] text-[#4a3f6b]/70 border border-violet-100 px-3 py-1.5 rounded-xl"
                >
                  {show}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
