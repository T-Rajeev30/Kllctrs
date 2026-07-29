"use client";

/**
 * ------------------------------------------------------------
 * FILE: AnalyticsLineChart.tsx
 * PURPOSE:
 * Reusable premium line chart component.
 * ------------------------------------------------------------
 */

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

interface AnalyticsLineChartProps {
  data: object[];
  dataKey: string;
  xKey: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="mb-1 text-sm font-semibold text-slate-900">{label}</p>

      <p className="text-sm text-sky-600">
        {payload[0].value.toLocaleString()} Visitors
      </p>
    </div>
  );
}

export default function AnalyticsLineChart({
  data,
  dataKey,
  xKey,
}: AnalyticsLineChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
        <p className="text-slate-500">No analytics available yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[360px]">
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="analyticsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />

                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>

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
                stroke: "#0ea5e9",
                strokeDasharray: "4 4",
              }}
              content={<CustomTooltip />}
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              fill="url(#analyticsGradient)"
              stroke="none"
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 7,
                fill: "#ffffff",
                stroke: "#0ea5e9",
                strokeWidth: 3,
              }}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
