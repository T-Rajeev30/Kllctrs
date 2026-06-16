"use client";

import DesktopAbout from "./DesktopAbout";
import MobileAbout from "./MobileAbout";

export default function AboutSection() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopAbout />
      </div>

      <div className="block md:hidden">
        <MobileAbout />
      </div>
    </>
  );
}
