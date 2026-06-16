"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Gem,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface HistoryEntry {
  id: string;
  created_at: string;
  card_name: string;
  player: string | null;
  year: string | null;
  brand: string | null;
  sport: string | null;
  grade: string | null;
  result_low: number | null;
  result_mid: number | null;
  result_high: number | null;
  result_grade: string | null;
  result_recommendation: string | null;
}

const GRADE_COLORS: Record<string, string> = {
  A: "text-green-600 bg-green-50 border-green-200",
  B: "text-violet-600 bg-violet-50 border-violet-200",
  C: "text-amber-700 bg-amber-50 border-amber-200",
  D: "text-orange-600 bg-orange-50 border-orange-200",
  F: "text-red-600 bg-red-50 border-red-200",
};

const REC_COLORS: Record<string, string> = {
  Buy: "text-green-600 bg-green-50",
  Sell: "text-red-600 bg-red-50",
  Hold: "text-amber-700 bg-amber-50",
};

export default function ValuationHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/cards/history")
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayed = showAll ? history : history.slice(0, 5);

  if (loading) {
    return (
      <div className="rounded-2xl border border-violet-100 bg-white/80 p-6 flex items-center justify-center gap-2 text-sm text-[#4a3f6b]/40">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading history…
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-3">
          <Gem className="w-5 h-5 text-[#5f2eea]/40" />
        </div>
        <p className="text-sm font-bold text-[#1a0a3d]">No appraisals yet</p>
        <p className="text-xs text-[#4a3f6b]/40 mt-1 mb-4">
          Your valuation history will appear here after your first appraisal.
        </p>
        <Link
          href="/tools/valuate"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5f2eea] hover:text-[#4a1fa8] transition-colors"
        >
          Appraise a card <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm shadow-lg shadow-violet-200/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-black tracking-[0.25em] text-[#5f2eea] uppercase">
          Appraisal History
        </h2>
        <span className="text-xs text-[#4a3f6b]/40 font-medium">
          {history.length} total
        </span>
      </div>

      <div className="space-y-2">
        {displayed.map((entry, i) => {
          const trendNum = entry.result_mid ?? 0;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-violet-100 bg-[#faf9ff] p-4 hover:border-violet-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Card info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a0a3d] truncate">
                    {entry.card_name}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    {entry.player && (
                      <span className="text-xs text-[#4a3f6b]/50">
                        {entry.player}
                      </span>
                    )}
                    {entry.year && (
                      <span className="text-xs text-[#4a3f6b]/35">
                        · {entry.year}
                      </span>
                    )}
                    {entry.brand && (
                      <span className="text-xs text-[#4a3f6b]/35">
                        · {entry.brand}
                      </span>
                    )}
                    {entry.grade && (
                      <span className="text-xs text-[#4a3f6b]/35">
                        · {entry.grade}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#4a3f6b]/30 mt-1">
                    {format(new Date(entry.created_at), "MMM d, yyyy · h:mm a")}
                  </p>
                </div>

                {/* Result */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {entry.result_mid !== null && (
                    <span className="text-base font-black text-[#5f2eea]">
                      ${entry.result_mid.toLocaleString()}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    {entry.result_grade && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${GRADE_COLORS[entry.result_grade] ?? GRADE_COLORS.C}`}
                      >
                        {entry.result_grade}
                      </span>
                    )}
                    {entry.result_recommendation && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${REC_COLORS[entry.result_recommendation] ?? REC_COLORS.Hold}`}
                      >
                        {entry.result_recommendation}
                      </span>
                    )}
                  </div>
                  {entry.result_low !== null && entry.result_high !== null && (
                    <p className="text-[10px] text-[#4a3f6b]/30">
                      ${entry.result_low.toLocaleString()} – $
                      {entry.result_high.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {history.length > 5 && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="w-full mt-3 py-2.5 rounded-xl border border-violet-200 text-xs font-bold text-[#5f2eea] hover:bg-violet-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> Show all {history.length}{" "}
              appraisals
            </>
          )}
        </button>
      )}

      <div className="mt-3 pt-3 border-t border-violet-100 flex items-center justify-between">
        <p className="text-[10px] text-[#4a3f6b]/30">
          Mid-price estimates · AI-generated · for reference only
        </p>
        <Link
          href="/tools/valuate"
          className="text-xs font-bold text-[#5f2eea] hover:text-[#4a1fa8] transition-colors flex items-center gap-1"
        >
          New appraisal <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
