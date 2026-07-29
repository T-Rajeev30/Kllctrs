import { RefreshCw, CalendarDays, BarChart3 } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="rounded-3xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-9 w-9 text-sky-400" />

            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>

          <p className="mt-2 text-slate-300">
            Real-time visitor insights across KLLCTRS.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 flex items-center gap-2 hover:bg-slate-700">
            <CalendarDays size={18} />
            Last 30 Days
          </button>

          <button className="rounded-xl bg-sky-500 px-4 py-2 flex items-center gap-2 hover:bg-sky-600">
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
