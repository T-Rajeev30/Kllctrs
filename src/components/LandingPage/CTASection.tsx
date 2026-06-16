"use client";

import DesktopCTASection from "./DesktopCTASection";
import MobileCTASection from "./MobileCTASection";

export default function CTASection() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopCTASection />
      </div>

      <div className="block md:hidden">
        <MobileCTASection />
      </div>
    </>
  );
}
