"use client";

import { useEffect, useState } from "react";

import MonthSelector from "./MonthSelector";
import YearSelector from "./YearSelector";
import StateSelector from "./StateSelector";

import { US_STATES } from "@/lib/tcdb/constants";
import { generateTcdbCalendarUrl } from "@/lib/tcdb/url-generator";

export default function CalendarGenerator() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [copied, setCopied] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  const [state, setState] = useState("AL");

  const [generatedUrl, setGeneratedUrl] = useState("");

  useEffect(() => {
    const selectedState = US_STATES.find((s) => s.code === state)!;

    setGeneratedUrl(generateTcdbCalendarUrl(month, year, selectedState));
  }, [month, year, state]);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(generatedUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL", error);
    }
  }

  function openUrl() {
    window.open(generatedUrl, "_blank");
  }

  return (
    <div className="space-y-8 rounded-xl border bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">Import Card Shows</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MonthSelector value={month} onChange={setMonth} />

        <YearSelector value={year} onChange={setYear} />

        <StateSelector value={state} onChange={setState} />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Generated URL</label>

        <input
          readOnly
          value={generatedUrl}
          className="w-full rounded-lg border bg-gray-50 px-4 py-3"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={copyUrl}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Copy URL
        </button>

        <button
          onClick={openUrl}
          className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
        >
          Open TCDB
        </button>

        {copied && (
          <span className="rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-700">
            ✅ URL copied to clipboard
          </span>
        )}
      </div>
    </div>
  );
}
