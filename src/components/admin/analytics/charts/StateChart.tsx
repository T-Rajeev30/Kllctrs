"use client";

import { StateStat } from "@/types/analytics";

import AnalyticsBarChart from "./AnalyticsBarChart";

interface Props {
  data: StateStat[];
}

export default function StateChart({ data }: Props) {
  return <AnalyticsBarChart data={data} dataKey="views" xKey="state" />;
}
