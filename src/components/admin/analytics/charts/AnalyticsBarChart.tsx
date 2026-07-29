"use client";

/**
 * ------------------------------------------------------------
 * FILE: AnalyticsBarChart.tsx
 * PURPOSE:
 * Premium reusable bar chart component.
 * ------------------------------------------------------------
 */

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface AnalyticsBarChartProps {
  data: object[];
  dataKey: string;
  xKey: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-slate-900">{label}</p>

      <p className="mt-1 text-sm text-sky-600">
        {payload[0].value.toLocaleString()} Visitors
      </p>
    </div>
  );
}

export default function AnalyticsBarChart({
  data,
  dataKey,
  xKey,
}: AnalyticsBarChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-[360px] items-center justify-center">
        <p className="text-slate-500">No analytics available.</p>
      </div>
    );
  }

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey={xKey}
            tick={{
              fill: "#64748b",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{
              fill: "#64748b",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={{
              fill: "rgba(14,165,233,0.08)",
            }}
            content={<CustomTooltip />}
          />

          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} animationDuration={1000}>
            {data.map((_, index) => (
              <Cell key={index} fill={index === 0 ? "#0284c7" : "#38bdf8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
