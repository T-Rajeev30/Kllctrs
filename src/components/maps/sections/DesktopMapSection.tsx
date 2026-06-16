"use client";

import EventMap from "@/components/maps/map/EventMap";
import ShopMap from "@/components/maps/map/ShopMap";

import EventSidebar from "../sidebars/EventSidebar";
import ShopSidebar from "../sidebars/ShopSidebar";
import MapFilters from "../filters/MapFilters";

export default function DesktopMapSection(props: any) {
  const {
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
    savedShopIds,
    setSavedShopIds,
    setSavedEventIds,
  } = props;

  return (
    <section className="max-w-[1200px] mx-auto py-8">
      <MapFilters
        mode={mode}
        setMode={setMode}
        search={search}
        setSearch={setSearch}
        city={city}
        setCity={setCity}
        cities={cities}
        category={category}
        setCategory={setCategory}
        categories={categories}
      />

      <div className="flex gap-6 mt-6">
        <div className="flex-1 h-[560px] rounded-[10px] overflow-hidden">
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

        {mode === "shows" ? (
          <EventSidebar
            events={filteredEvents}
            savedIds={savedEventIds}
            setSavedEventIds={setSavedEventIds}
          />
        ) : (
          <ShopSidebar
            shops={filteredShops}
            savedIds={savedShopIds}
            setSavedShopIds={setSavedShopIds}
            selectedShop={selectedShop}
            onShopSelect={setSelectedShop}
          />
        )}
      </div>
    </section>
  );
}
