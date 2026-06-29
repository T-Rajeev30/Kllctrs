"use client";

import { useState } from "react";

import ImportStatus from "@/components/admin/event-import/ImportStatus";

export default function TestPage() {
  const [step, setStep] = useState<
    | "idle"
    | "uploaded"
    | "parsing"
    | "parsed"
    | "geocoding"
    | "importing"
    | "completed"
    | "error"
  >("idle");

  return (
    <div className="mx-auto mt-20 max-w-5xl space-y-8 p-8">
      <div className="flex flex-wrap gap-2">
        {[
          "idle",
          "uploaded",
          "parsing",
          "parsed",
          "geocoding",
          "importing",
          "completed",
          "error",
        ].map((value) => (
          <button
            key={value}
            onClick={() => setStep(value as any)}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            {value}
          </button>
        ))}
      </div>

      <ImportStatus
        currentStep={step}
        message={`Current Status : ${step}`}
        eventsFound={143}
        imported={127}
        failed={4}
      />
    </div>
  );
}
