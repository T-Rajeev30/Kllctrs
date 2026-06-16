"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save, CheckCircle2, Loader2, Clock } from "lucide-react";
import LinkedInPreview from "@/components/admin/LinkedInPreview";

interface Props {
  post: {
    id: string;
    title: string;
    slug: string;
    body: string;
    meta_description: string | null;
    status: string;
    author: string | null;
  };
}

export default function AdminBlogEditClient({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [metaDesc, setMetaDesc] = useState(post.meta_description ?? "");
  const [body, setBody] = useState(post.body);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const handleSave = async (publish = false) => {
    setSaving(true);
    const update: Record<string, unknown> = {
      title,
      meta_description: metaDesc,
      body,
    };
    if (publish) update.status = "published";

    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    setSaving(false);

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Save failed");
      return;
    }

    setSavedAt(new Date());
    if (publish) router.push("/admin/blog?status=published");
  };

  const inputClass =
    "w-full px-3 rounded-xl border border-violet-200 bg-white text-[#1a0a3d] text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors";
  const labelClass = "text-xs font-medium text-[#4a3f6b]/60 block mb-1.5";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[#5f2eea] hover:text-[#4a1fa8] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Posts
        </Link>
        <div className="flex items-center gap-2 text-xs text-[#4a3f6b]/40">
          <span
            className={`px-2 py-0.5 rounded-full font-bold capitalize ${
              post.status === "published"
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-violet-50 text-[#5f2eea] border border-violet-200"
            }`}
          >
            {post.status}
          </span>
          {savedAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Saved {savedAt.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-xl shadow-violet-200/30 p-6 space-y-5">
        <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
          Edit Post
        </h2>

        {/* Title */}
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${inputClass} h-11 font-bold text-base`}
          />
        </div>

        {/* Meta description */}
        <div>
          <label className={labelClass}>
            Meta Description ({metaDesc.length}/155)
            <span
              className={`ml-2 ${metaDesc.length > 140 ? "text-amber-500" : "text-[#4a3f6b]/30"}`}
            >
              {155 - metaDesc.length} left
            </span>
          </label>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            rows={2}
            maxLength={155}
            className={`${inputClass} py-2.5 resize-none`}
          />
        </div>

        {/* Body */}
        <div>
          <label className={labelClass}>Body (Markdown)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={24}
            className={`${inputClass} py-3 font-mono text-xs leading-relaxed resize-y`}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-violet-100">
          <motion.button
            onClick={() => handleSave(false)}
            disabled={saving}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-5 rounded-xl border border-violet-200 text-sm font-bold text-[#4a3f6b] hover:bg-violet-50 flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Draft
          </motion.button>

          <motion.button
            onClick={() => handleSave(true)}
            disabled={saving}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="h-10 px-5 rounded-xl text-sm font-black text-white flex items-center gap-2 border-0 shadow-lg shadow-green-500/20 disabled:opacity-50 cursor-pointer transition-colors bg-green-500 hover:bg-green-600"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Save & Publish
          </motion.button>
        </div>
      </div>

      {/* LinkedIn Preview */}
      <LinkedInPreview title={title} description={metaDesc} slug={post.slug} />
    </div>
  );
}
