"use client";

import DesktopHero from "./DesktopHero";
import MobileHero from "./MobileHero";

export default function HeroSection() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopHero />
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <MobileHero />
      </div>
    </>
  );
}
