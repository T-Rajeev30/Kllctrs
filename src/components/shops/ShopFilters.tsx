"use client";

import { useState } from "react";

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

export interface ShopFilterState {
  state?: string;
  city?: string;
  keyword?: string;
  specialty?: string;
}

interface Props {
  onFilter: (filters: ShopFilterState) => void;
}

export default function ShopFilters({ onFilter }: Props) {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleApply = () => onFilter({ state, city, keyword, specialty });
  const handleReset = () => {
    setState("");
    setCity("");
    setKeyword("");
    setSpecialty("");
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
        <label className="text-xs text-muted-foreground">Specialty</label>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm min-w-[120px]"
        >
          <option value="">All</option>
          <option value="sports">Sports Cards</option>
          <option value="pokemon">Pokémon</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Keyword</label>
        <input
          type="text"
          placeholder="Search shops..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm w-[180px]"
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
