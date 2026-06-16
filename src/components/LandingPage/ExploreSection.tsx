"use client";

import DesktopExplore from "./DesktopExplore";
import MobileExplore from "./MobileExplore";

export default function ExploreSection() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopExplore />
      </div>

      <div className="block md:hidden">
        <MobileExplore />
      </div>
    </>
  );
}
