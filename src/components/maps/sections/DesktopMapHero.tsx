// DesktopMapHero.tsx

import { Inter, Space_Grotesk, Unica_One } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

const unica = Unica_One({
  weight: "400",
  subsets: ["latin"],
});

export default function DesktopMapHero() {
  return (
    <section className="relative w-full h-[300px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(89.06deg,#8B5CF6_0.7%,#151E3C_73.95%)]" />

      <img
        src="/Maps-assets/map-hero.png"
        alt="Map Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute left-[120px] top-[109px] flex flex-col gap-5 w-[463px] text-white">
        <p
          className={`${spaceGrotesk.className}
          text-[11px]
          font-medium
          uppercase
          tracking-[0.15em]
          leading-[14px]`}
        >
          DISCOVER
        </p>

        <h1
          className={`${unica.className}
          text-[48px]
          leading-[50px]
          tracking-[-0.04em]
          font-normal`}
        >
          Find the hobby near you
        </h1>

        <p
          className={`${inter.className}
          text-[16px]
          leading-[18px]
          font-normal`}
        >
          Explore shops, card shows, trade nights and collector hotspots across
          the map.
        </p>
      </div>
    </section>
  );
}
