"use client";

/**
 * ------------------------------------------------------------
 * FILE: TimelineChart.tsx
 * PURPOSE:
 * Displays visitor activity over time.
 * ------------------------------------------------------------
 */

import { TimelineStat } from "@/types/analytics";
import AnalyticsLineChart from "./AnalyticsLineChart";

interface Props {
  data: TimelineStat[];
}

export default function TimelineChart({ data }: Props) {
  return <AnalyticsLineChart data={data} dataKey="views" xKey="date" />;
}
