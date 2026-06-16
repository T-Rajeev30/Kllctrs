"use client";

import ShopCard from "@/components/maps/cards/ShopCard";
import type { Shop } from "@/types";

interface Props {
  shops?: Shop[];
}

export default function SavedShops({ shops = [] }: Props) {
  if (shops.length === 0) {
    return (
      <section className="mt-10">
        <h2 className="mb-6 text-2xl font-bold">Saved Shops</h2>

        <div className="rounded-3xl border-2 border-dashed border-violet-200 bg-violet-50 py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow">
            ⭐
          </div>

          <h3 className="text-xl font-bold text-zinc-900">
            No Saved Shops Yet
          </h3>

          <p className="mt-2 text-zinc-500">
            Save your favourite shops to quickly find them later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-zinc-900">Saved Shops</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Your favourite local card stores and collectibles destinations.
          </p>
        </div>

        <div className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
          {shops.length} Saved
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </section>
  );
}
