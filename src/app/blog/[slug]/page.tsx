import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Calendar,
  User,
  ExternalLink,
  Newspaper,
} from "lucide-react";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("content")
    .select("title, meta_description")
    .eq("type", "blog")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return { title: "Post Not Found | KLLCTRS" };

  return {
    title: `${data.title} | KLLCTRS`,
    description: data.meta_description ?? "",
    openGraph: {
      title: data.title,
      description: data.meta_description ?? "",
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("content")
    .select("*")
    .eq("type", "blog")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  let sourceEvent = null;
  if (post.source_event_id) {
    const { data } = await supabase
      .from("events")
      .select("name, slug, city, state, date_start")
      .eq("id", post.source_event_id)
      .eq("status", "approved")
      .single();
    sourceEvent = data;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description ?? "",
    author: {
      "@type": "Organization",
      name: post.author ?? "KLLCTRS Editorial",
    },
    publisher: { "@type": "Organization", name: "KLLCTRS" },
    datePublished: post.published_at,
    dateModified: post.updated_at ?? post.published_at,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#f4f3fb] via-[#ede9ff] to-[#f4f3fb] pt-24">
        {/* Ambience */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[150px]" />
          <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[120px]" />
        </div>

        {/* Header nav */}
        <div className="relative z-10 border-b border-violet-100 bg-white/70 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-[#5f2eea] hover:text-[#4a1fa8] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Posts
            </Link>
          </div>
        </div>

        <article className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Hero card */}
          <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-7 sm:p-10">
            {/* Type badge */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-violet-50 text-[#5f2eea] border border-violet-200 px-2.5 py-1 rounded-full">
                <Newspaper className="w-3 h-3" /> Blog Post
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-[#1a0a3d] tracking-tight leading-tight mb-5">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#4a3f6b]/50 pb-6 border-b border-violet-100">
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {post.author ?? "KLLCTRS Editorial"}
              </span>
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(post.published_at), "MMMM d, yyyy")}
                </span>
              )}
            </div>

            {/* Body */}
            <div
              className="prose prose-violet max-w-none mt-6
              prose-headings:font-black prose-headings:text-[#1a0a3d] prose-headings:tracking-tight
              prose-p:text-[#4a3f6b]/70 prose-p:leading-relaxed
              prose-a:text-[#5f2eea] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#1a0a3d] prose-strong:font-bold
              prose-li:text-[#4a3f6b]/70
              prose-hr:border-violet-100
              prose-blockquote:border-[#5f2eea] prose-blockquote:text-[#4a3f6b]/60
              prose-code:text-[#5f2eea] prose-code:bg-violet-50 prose-code:rounded prose-code:px-1"
            >
              <ReactMarkdown>{post.body}</ReactMarkdown>
            </div>
          </div>

          {/* Source event CTA */}
          {sourceEvent && (
            <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-6">
              <p className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase mb-3">
                Featured Event
              </p>
              <h3 className="text-lg font-black text-[#1a0a3d] mb-1">
                {sourceEvent.name}
              </h3>
              <p className="text-sm text-[#4a3f6b]/50 mb-4">
                {format(new Date(sourceEvent.date_start), "MMMM d, yyyy")} ·{" "}
                {sourceEvent.city}, {sourceEvent.state}
              </p>
              <Link
                href={`/events/${sourceEvent.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-black text-white px-5 py-2.5 rounded-xl shadow-lg shadow-violet-500/20"
                style={{
                  background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
                }}
              >
                View Event Details <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Footer CTA */}
          <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-6 text-center">
            <p className="text-sm text-[#4a3f6b]/50 mb-3">
              Find more card shows and shops on KLLCTRS
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/events"
                className="text-sm font-bold text-[#5f2eea] hover:text-[#4a1fa8] transition-colors inline-flex items-center gap-1"
              >
                Browse Events <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
              <span className="text-[#4a3f6b]/20">·</span>
              <Link
                href="/blog"
                className="text-sm font-bold text-[#5f2eea] hover:text-[#4a1fa8] transition-colors inline-flex items-center gap-1"
              >
                All Posts <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
