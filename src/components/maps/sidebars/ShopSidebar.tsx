"use client";

import type { Shop } from "@/types";
import ShopCard from "../cards/ShopCard";

interface Props {
  shops: Shop[];
  savedIds: string[];
  setSavedShopIds: React.Dispatch<React.SetStateAction<string[]>>;

  selectedShop?: any;
  onShopSelect?: (shop: any) => void;
}

export default function ShopSidebar({
  shops,
  savedIds,
  setSavedShopIds,
}: Props) {
  return (
    <div className="w-[352px] h-[560px] overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-3">
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            isSaved={savedIds.includes(shop.id)}
            savedShopIds={savedIds}
            setSavedShopIds={setSavedShopIds}
          />
        ))}
      </div>
    </div>
  );
}
