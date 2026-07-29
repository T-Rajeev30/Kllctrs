"use client";

import { CountryStat } from "@/types/analytics";

import AnalyticsBarChart from "./AnalyticsBarChart";

interface Props {
  data: CountryStat[];
}

export default function CountryChart({ data }: Props) {
  return <AnalyticsBarChart data={data} dataKey="views" xKey="country" />;
}
