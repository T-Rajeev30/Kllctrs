"use client";

/**
 * ------------------------------------------------------------
 * FILE: LoadingDashboard.tsx
 * PURPOSE:
 * Premium loading skeleton for the analytics dashboard.
 * ------------------------------------------------------------
 */

function Skeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />
  );
}

export default function LoadingDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-56" />
        </div>

        <Skeleton className="h-10 w-32" />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="space-y-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-[360px] w-full" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>

            <Skeleton className="h-[360px] w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
