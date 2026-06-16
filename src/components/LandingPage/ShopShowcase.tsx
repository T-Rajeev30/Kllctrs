"use client";

import DesktopShopShowcase from "./DesktopShopShowcase";
import MobileShopShowcase from "./MobileShopShowcase";

export default function ShopShowcase() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopShopShowcase />
      </div>

      <div className="block md:hidden">
        <MobileShopShowcase />
      </div>
    </>
  );
}
