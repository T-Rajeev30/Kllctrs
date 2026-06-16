"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Loader2,
  Sparkles,
  TriangleAlert,
  Lock,
} from "lucide-react";

interface Valuation {
  low: number;
  mid: number;
  high: number;
  grade: string;
  trend: string;
  overview: string;
  recommendation: string;
  recommendationDetail: string;
  keyFactors: string[];
  recentSales: Array<{ label: string; price: string }>;
  remaining?: number | null;
}

const SPORTS = [
  "Baseball",
  "Basketball",
  "Football",
  "Hockey",
  "Soccer",
  "Pokemon",
  "Yu-Gi-Oh",
  "Magic",
  "Other",
];

const GRADES = [
  "Raw (Ungraded)",
  "PSA 10",
  "PSA 9",
  "PSA 8",
  "PSA 7",
  "BGS 10",
  "BGS 9.5",
  "BGS 9",
  "CGC 10",
  "CGC 9.5",
  "SGC 10",
  "SGC 9.5",
];

const GRADE_COLORS: Record<string, string> = {
  A: "text-green-400 bg-green-500/10 border-green-500/30",
  B: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  C: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  D: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  F: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function CardValuation() {
  const [form, setForm] = useState({
    cardName: "",
    player: "",
    year: "",
    brand: "",
    sport: "Baseball",
    grade: "Raw (Ungraded)",
  });
  const [result, setResult] = useState<Valuation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  const update = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const analyze = async () => {
    if (!form.cardName.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setLimitReached(false);

    try {
      // Step 1: Fetch eBay comps
      const compsRes = await fetch("/api/cards/ebay-comps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const compsData = await compsRes.json();

      // Step 2: Send to Gemini with comps
      const valRes = await fetch("/api/cards/valuate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ebayComps: compsData.comps ?? [] }),
      });

      if (valRes.status === 401) {
        setError("Please log in to use card valuation.");
        return;
      }

      if (valRes.status === 429) {
        const data = await valRes.json();
        setLimitReached(true);
        setError(data.message);
        return;
      }

      if (!valRes.ok) throw new Error("Analysis failed");

      const valuation: Valuation = await valRes.json();
      setResult(valuation);
      if (valuation.remaining !== null && valuation.remaining !== undefined) {
        setRemaining(valuation.remaining);
      }
    } catch {
      setError("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const trendNum = result ? parseFloat(result.trend) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">
                  AI Card Valuation
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Get AI-powered market analysis and price estimates for any card
              </p>
            </div>
            {remaining !== null && (
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">
                  {remaining > 0 ? (
                    <>
                      <span className="text-primary">{remaining}</span>{" "}
                      <span className="text-muted-foreground">
                        free left today
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">0 free left</span>
                  )}
                </p>
                <Link
                  href="/pricing"
                  className="text-xs text-primary hover:underline"
                >
                  Upgrade
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Form */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Card Details
          </h2>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Card Name / Description *
            </label>
            <input
              value={form.cardName}
              onChange={(e) => update("cardName", e.target.value)}
              placeholder="e.g. 1986 Fleer Michael Jordan #57"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Player / Character
              </label>
              <input
                value={form.player}
                onChange={(e) => update("player", e.target.value)}
                placeholder="e.g. Michael Jordan"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Year</label>
              <input
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                placeholder="e.g. 1986"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Brand / Set
              </label>
              <input
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                placeholder="e.g. Fleer"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Sport / Category
              </label>
              <select
                value={form.sport}
                onChange={(e) => update("sport", e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Condition / Grade
              </label>
              <select
                value={form.grade}
                onChange={(e) => update("grade", e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={analyze}
            disabled={loading || !form.cardName.trim() || limitReached}
            className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
              </>
            ) : limitReached ? (
              <>
                <Lock className="w-4 h-4" /> Upgrade to Continue
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Analyze Value
              </>
            )}
          </button>
        </div>

        {/* Limit Reached */}
        <AnimatePresence>
          {limitReached && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center"
            >
              <Lock className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-1">Daily Limit Reached</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You&apos;ve used all 3 free appraisals for today. Upgrade for
                unlimited valuations.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> View Plans
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error (non-limit) */}
        {error && !limitReached && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex items-center gap-2 text-sm text-red-400">
            <TriangleAlert className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Disclaimer */}
        {(result || loading) && (
          <p className="text-xs text-muted-foreground text-center">
            AI estimates — for reference only
          </p>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Price Estimate */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Estimated Value
                </h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-muted-foreground">
                      ${result.low.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Low</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      ${result.mid.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Mid</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-muted-foreground">
                      ${result.high.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">High</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-sm">
                    {trendNum > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : trendNum < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    ) : (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span
                      className={
                        trendNum > 0
                          ? "text-green-400"
                          : trendNum < 0
                            ? "text-red-400"
                            : "text-muted-foreground"
                      }
                    >
                      {result.trend}
                    </span>
                    <span className="text-muted-foreground">over 6 months</span>
                  </div>
                  <div
                    className={`text-sm font-bold px-2.5 py-0.5 rounded-md border ${GRADE_COLORS[result.grade] ?? GRADE_COLORS.C}`}
                  >
                    Grade {result.grade}
                  </div>
                </div>
              </div>

              {/* Market Overview */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Market Overview
                </h2>
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                  {result.overview}
                </p>
                <div
                  className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border ${
                    result.recommendation === "Buy"
                      ? "text-green-400 bg-green-500/10 border-green-500/30"
                      : result.recommendation === "Sell"
                        ? "text-red-400 bg-red-500/10 border-red-500/30"
                        : "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
                  }`}
                >
                  {result.recommendation}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {result.recommendationDetail}
                </p>
              </div>

              {/* Key Factors */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Key Value Factors
                </h2>
                <ul className="space-y-2">
                  {result.keyFactors.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Sales */}
              {result.recentSales.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Recent Comparable Sales
                  </h2>
                  <ul className="space-y-2">
                    {result.recentSales.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-foreground/80">{s.label}</span>
                        <span className="font-medium text-primary shrink-0 ml-3">
                          {s.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
