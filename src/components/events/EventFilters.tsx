"use client";

import { useState } from "react";
import type { EventFilters } from "@/types";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

interface Props {
  onFilter: (filters: EventFilters) => void;
}

export default function EventFiltersBar({ onFilter }: Props) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleApply = () => {
    onFilter({ state, city, keyword, dateFrom, dateTo });
  };

  const handleReset = () => {
    setState("");
    setCity("");
    setKeyword("");
    setDateFrom("");
    setDateTo("");
    onFilter({});
  };

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">State</label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm min-w-[80px]"
        >
          <option value="">All</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">City</label>
        <input
          type="text"
          placeholder="e.g. Dallas"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm w-[140px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Keyword</label>
        <input
          type="text"
          placeholder="Search shows..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm w-[180px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">From</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">To</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
      </div>

      <button
        onClick={handleApply}
        className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium"
      >
        Apply
      </button>
      <button
        onClick={handleReset}
        className="h-9 px-4 rounded-md border border-input text-sm"
      >
        Reset
      </button>
    </div>
  );
}
