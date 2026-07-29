"use client";

import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface DashboardSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function DashboardSection({
  title,
  description,
  children,
  action,
}: DashboardSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-sky-500" />

            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          </div>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>

        {action && <div className="flex items-center">{action}</div>}
      </div>

      <div className="min-h-[300px]">{children}</div>
    </section>
  );
}
