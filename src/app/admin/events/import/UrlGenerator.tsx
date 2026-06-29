"use client";

import { useEffect, useMemo, useState } from "react";

import { Copy, ExternalLink, Link2 } from "lucide-react";

import { MONTHS, US_STATES } from "@/lib/tcdb/constants";

import { generateTcdbCalendarUrl } from "@/lib/tcdb/url-generator";

export default function UrlGenerator() {
  //---------------------------------------
  // Initial Values
  //---------------------------------------

  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);

  const [year, setYear] = useState(today.getFullYear());

  const [stateCode, setStateCode] = useState("AL");

  //---------------------------------------
  // Selected State
  //---------------------------------------

  const selectedState = useMemo(() => {
    return US_STATES.find((state) => state.code === stateCode) ?? US_STATES[0];
  }, [stateCode]);

  //---------------------------------------
  // URL
  //---------------------------------------

  const url = useMemo(() => {
    return generateTcdbCalendarUrl(month, year, selectedState);
  }, [month, year, selectedState]);

  //---------------------------------------
  // Copy
  //---------------------------------------

  async function copyUrl() {
    await navigator.clipboard.writeText(url);

    alert("URL copied.");
  }

  //---------------------------------------

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5" />

        <h2 className="text-xl font-semibold">Generate TCDB Calendar URL</h2>
      </div>

      {/* Filters */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Month */}

        <div>
          <label className="mb-2 block text-sm font-medium">Month</label>

          <select
            className="w-full rounded-lg border px-3 py-2"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}

        <div>
          <label className="mb-2 block text-sm font-medium">Year</label>

          <select
            className="w-full rounded-lg border px-3 py-2"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => today.getFullYear() + i).map(
              (y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ),
            )}
          </select>
        </div>

        {/* State */}

        <div>
          <label className="mb-2 block text-sm font-medium">State</label>

          <select
            className="w-full rounded-lg border px-3 py-2"
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value)}
          >
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* URL */}

      <div>
        <label className="mb-2 block text-sm font-medium">Generated URL</label>

        <input
          value={url}
          readOnly
          className="w-full rounded-lg border bg-muted px-3 py-2 text-sm"
        />
      </div>

      {/* Buttons */}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={copyUrl}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
        >
          <Copy className="h-4 w-4" />
          Copy URL
        </button>

        <button
          onClick={() => window.open(url, "_blank")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4" />
          Open URL
        </button>
      </div>
    </div>
  );
}
