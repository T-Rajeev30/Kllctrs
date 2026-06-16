"use client";

import { Search, LayoutGrid } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  tierFilter: string;
  setTierFilter: (value: string) => void;

  categoryFilter: string;
  setCategoryFilter: (value: string) => void;

  sortBy: string;
  setSortBy: (value: string) => void;
}

const categories = [
  { label: "All", value: "all" },
  { label: "Grading", value: "grading" },
  { label: "Auction", value: "auction" },
  { label: "Manufacturer", value: "manufacturer" },
  { label: "Marketplace", value: "marketplace" },
  { label: "Breaker", value: "breaker" },
  { label: "Shop", value: "shop" },
  { label: "Software", value: "software" },
];

export default function SponsorsFilters({
  search,
  setSearch,
  tierFilter,
  setTierFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
}: Props) {
  return (
    <section className="w-full bg-transparent mt-8">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-4 md:gap-6 md:items-center md:justify-between">
        {/* LEFT TOGGLES */}
        <div className="flex w-full overflow-x-auto scrollbar-hide pb-2 md:pb-0">
          {" "}
          {categories.map((item, index) => {
            const active = categoryFilter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategoryFilter(item.value)}
                className={`h-8 whitespace-nowrap px-3 border border-[#8B5CF6] text-[11px] font-normal transition-all duration-200 ${active ? "bg-[#8B5CF6] text-white" : "bg-[#FEF9FF] text-black hover:bg-[#F5F0FF]"} ${index === 0 ? "rounded-l-[20px]" : index === categories.length - 1 ? "rounded-r-[20px]" : "rounded-none"} -ml-px`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-[421px] h-10 shrink-0">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your next hobby station"
            className="w-full h-full rounded-[10px] border border-[#B39EF9] bg-[#FEF9FF] pl-4 pr-10 text-[13px] md:text-[12px] text-black placeholder:text-[#B39EF9] outline-none transition-all focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
          />

          <Search
            size={18}
            strokeWidth={1.5}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B5CF6]"
          />
        </div>
      </div>
    </section>
  );
}
