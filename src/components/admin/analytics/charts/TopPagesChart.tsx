"use client";

import { PageStat } from "@/types/analytics";

import AnalyticsBarChart from "./AnalyticsBarChart";

interface Props {
  data: PageStat[];
}

export default function TopPagesChart({ data }: Props) {
  return <AnalyticsBarChart data={data} dataKey="views" xKey="page" />;
}
