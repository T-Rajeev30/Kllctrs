"use client";

import { Calendar, Search, ShoppingBag } from "lucide-react";

import EventMap from "@/components/maps/map/EventMap";
import ShopMap from "@/components/maps/map/ShopMap";

import EventCard from "../cards/EventCard";
import ShopCard from "../cards/ShopCard";

interface MobileMapSectionProps {
  mode: string;
  setMode: (mode: string) => void;
  search: string;
  setSearch: (search: string) => void;
  city: string;
  setCity: (city: string) => void;
  cities: string[];
  category: string;
  setCategory: (category: string) => void;
  categories: string[];
  filteredEvents: any[];
  filteredShops: any[];
  selectedEvent: any;
  setSelectedEvent: (event: any) => void;
  selectedShop: any;
  setSelectedShop: (shop: any) => void;
  savedShopIds: string[];
  savedEventIds: string[];

  setSavedEventIds: React.Dispatch<React.SetStateAction<string[]>>;

  setSavedShopIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function MobileMapSection({
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
  filteredEvents,
  filteredShops,
  selectedEvent,
  setSelectedEvent,
  selectedShop,
  setSelectedShop,
  savedShopIds,
  setSavedShopIds,
  savedEventIds,
  setSavedEventIds,
}: MobileMapSectionProps) {
  return (
    <section className="pb-8">
      {/* FILTER CARD */}
      <div className="mx-4 mt-6 rounded-2xl bg-white p-4 shadow-lg">
        {/* TOGGLE */}
        <div className="flex h-10 overflow-hidden rounded-full border border-[#8B5CF6]">
          <button
            onClick={() => setMode("shows")}
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-medium transition-all ${mode === "shows" ? "bg-[#8B5CF6] text-white" : "bg-white text-gray-700"}`}
          >
            <Calendar size={16} />
            Shows
          </button>

          <button
            onClick={() => setMode("shops")}
            className={`flex flex-1 items-center justify-center gap-2 text-sm font-medium transition-all ${mode === "shops" ? "bg-[#8B5CF6] text-white" : "bg-white text-gray-700"}`}
          >
            <ShoppingBag size={16} />
            Shops
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mt-4">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              mode === "shows" ? "Search shows..." : "Search shops..."
            }
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition-all focus:border-[#8B5CF6] focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* FILTERS */}
        <div
          className={`mt-3 grid gap-3 ${mode === "shops" ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {mode === "shops" && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          )}

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm"
          >
            <option value="">All Cities</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MAP */}
      <div className="mt-5 px-4">
        <div className="h-[350px] overflow-hidden rounded-2xl shadow-md">
          {mode === "shows" ? (
            <EventMap
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
            />
          ) : (
            <ShopMap
              shops={filteredShops}
              selectedShop={selectedShop}
              onShopSelect={setSelectedShop}
            />
          )}
        </div>
      </div>

      {/* MOBILE CAROUSEL */}
      <div className="mt-5 overflow-x-auto">
        <div className="flex gap-3 px-4 pb-2">
          {mode === "shows"
            ? filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="min-w-[85vw] max-w-[85vw] flex-shrink-0 cursor-pointer"
                >
                  <EventCard
                    event={event}
                    isSaved={savedEventIds.includes(event.id)}
                    savedEventIds={savedEventIds}
                    setSavedEventIds={setSavedEventIds}
                  />
                </div>
              ))
            : filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  className="min-w-[85vw] max-w-[85vw] flex-shrink-0 cursor-pointer"
                >
                  <ShopCard
                    shop={shop}
                    isSaved={savedShopIds.includes(shop.id)}
                    savedShopIds={savedShopIds}
                    setSavedShopIds={setSavedShopIds}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
