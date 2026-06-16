import DesktopAppraiseToolShowcase from "./DesktopAppraiseToolShowcase";
import MobileAppraiseToolShowcase from "./MobileAppraiseToolShowcase";

export default function AppraiseToolShowcase() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopAppraiseToolShowcase />
      </div>

      <div className="block md:hidden">
        <MobileAppraiseToolShowcase />
      </div>
    </>
  );
}
