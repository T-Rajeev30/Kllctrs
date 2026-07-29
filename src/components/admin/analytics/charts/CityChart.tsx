"use client";

import { CityStat } from "@/types/analytics";

import AnalyticsBarChart from "./AnalyticsBarChart";

interface Props {
  data: CityStat[];
}

export default function CityChart({ data }: Props) {
  return <AnalyticsBarChart data={data} dataKey="views" xKey="city" />;
}
