"use client";

import { Search, Calendar, ShoppingBag } from "lucide-react";

interface Props {
  mode: "shows" | "shops";
  setMode: (mode: "shows" | "shops") => void;

  search: string;
  setSearch: (value: string) => void;

  city: string;
  setCity: (value: string) => void;

  cities: string[];

  category: string;
  setCategory: (value: string) => void;

  categories: string[];
}

export default function MapFilters({
  mode,
  setMode,
  search,
  setSearch,
  city,
  setCity,
  cities,
  category,
  setCategory,
  categories,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-10 mb-8 mt-8 flex-wrap">
      {/* Toggle */}

      <div className="flex h-8">
        <button
          onClick={() => setMode("shows")}
          className={`flex items-center gap-2 px-4 rounded-l-[20px] text-[11px]
            ${
              mode === "shows"
                ? "bg-[#8B5CF6] text-white"
                : "bg-white border border-[#8B5CF6]"
            }
          `}
        >
          <Calendar size={16} />
          Shows
        </button>

        <button
          onClick={() => setMode("shops")}
          className={`flex items-center gap-2 px-4 rounded-r-[20px] text-[11px]
            ${
              mode === "shops"
                ? "bg-[#8B5CF6] text-white"
                : "bg-white border border-[#8B5CF6]"
            }
          `}
        >
          <ShoppingBag size={16} />
          Shops
        </button>
      </div>

      {/* Search */}

      <div className="flex items-center justify-between w-[363px] h-[40px] px-6 border border-[#B39EF9] rounded-[10px] bg-white">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search your next hobby station"
          className="outline-none text-[12px] text-[#1E1E1E] flex-1"
        />

        <Search size={16} className="text-[#8B5CF6]" />
      </div>

      {/* Category */}

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-[160px] h-[32px] px-3 border border-[#B39EF9] rounded-[10px] bg-white text-[12px]"
      >
        <option value="">All Categories</option>

        {categories.map((categoryName) => (
          <option key={categoryName} value={categoryName}>
            {categoryName}
          </option>
        ))}
      </select>

      {/* City */}

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-[140px] h-[32px] px-3 border border-[#B39EF9] rounded-[10px] bg-white text-[12px]"
      >
        <option value="">All Cities</option>

        {cities.map((cityName) => (
          <option key={cityName} value={cityName}>
            {cityName}
          </option>
        ))}
      </select>

      {/* Clear */}

      <button
        onClick={() => {
          setSearch("");
          setCity("");
          setCategory("");
        }}
        className="w-[114px] h-[32px] rounded-[10px] bg-[#8B5CF6] text-white text-[14px] shadow"
      >
        Clear
      </button>
    </div>
  );
}
