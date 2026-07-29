"use client";

/**
 * ------------------------------------------------------------
 * FILE: EmptyDashboard.tsx
 * PURPOSE:
 * Displayed when there is no analytics data.
 * ------------------------------------------------------------
 */

import { BarChart3 } from "lucide-react";

export default function EmptyDashboard() {
  return (
    <div className="flex min-h-[600px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100">
          <BarChart3 className="h-10 w-10 text-sky-600" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">No analytics yet</h2>

        <p className="mt-3 text-slate-500">
          Once visitors start using your platform, you'll see page views,
          countries, cities, and visitor trends here.
        </p>
      </div>
    </div>
  );
}
