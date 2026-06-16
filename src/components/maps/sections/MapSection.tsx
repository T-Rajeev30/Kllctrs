"use client";

import { useState } from "react";

import DesktopMapSection from "./DesktopMapSection";
import MobileMapSection from "./MobileMapSection";

export default function MapSection({
  mode,
  setMode,
  events,
  shops,
  savedEventIds,
  setSavedEventIds,
  savedShopIds,
  setSavedShopIds,
}: any) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  /* EVENTS FILTER */

  const filteredEvents = events.filter((event: any) => {
    const matchesSearch =
      search === "" || event.name?.toLowerCase().includes(search.toLowerCase());

    const matchesCity =
      city === "" || event.city?.toLowerCase() === city.toLowerCase();

    return matchesSearch && matchesCity;
  });

  /* SHOPS FILTER */

  const filteredShops = shops.filter((shop: any) => {
    const matchesSearch =
      search === "" || shop.name?.toLowerCase().includes(search.toLowerCase());

    const matchesCity =
      city === "" || shop.city?.toLowerCase() === city.toLowerCase();

    const matchesCategory = category === "" || shop.specialty === category;

    return matchesSearch && matchesCity && matchesCategory;
  });

  /* CITIES */

  const cities =
    mode === "shows"
      ? [...new Set(events.map((e: any) => e.city))]
      : [...new Set(shops.map((s: any) => s.city))];

  cities.sort();

  /* CATEGORIES */

  const categories = [
    ...new Set(shops.map((shop: any) => shop.specialty).filter(Boolean)),
  ].sort();

  const sharedProps = {
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

    savedEventIds,
    setSavedEventIds,

    savedShopIds,
    setSavedShopIds,
  };

  return (
    <>
      {/* MOBILE */}

      <div className="lg:hidden">
        <MobileMapSection {...sharedProps} />
      </div>

      {/* DESKTOP */}

      <div className="hidden lg:block">
        <DesktopMapSection {...sharedProps} />
      </div>
    </>
  );
}
