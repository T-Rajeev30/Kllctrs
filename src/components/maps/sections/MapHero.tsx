import DesktopMapHero from "./DesktopMapHero";
import MobileMapHero from "./MobileMapHero";

export default function MapHero() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopMapHero />
      </div>

      <div className="block md:hidden">
        <MobileMapHero />
      </div>
    </>
  );
}
