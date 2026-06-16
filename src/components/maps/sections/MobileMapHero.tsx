// MobileMapHero.tsx

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

export default function MobileMapHero() {
  return (
    <section className="relative w-full h-[300px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(89.06deg,#8B5CF6_0.7%,#151E3C_73.95%)]" />

      <img
        src="/Maps-assets/map-hero.png"
        alt="Map Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute left-8 top-[107px] flex flex-col gap-5 w-[258px] text-white">
        <p
          className={`${spaceGrotesk.className}
          text-[12px]
          font-medium
          uppercase
          tracking-[0.15em]`}
        >
          DISCOVER
        </p>

        <h1
          className={`${unica.className}
          text-[36px]
          leading-[32px]
          tracking-[-0.04em]
          font-normal`}
        >
          Find the hobby near you
        </h1>

        <p
          className={`${inter.className}
          text-[12px]
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

// export default function MobileMapHero() {
//   return <div className="h-[300px] bg-green-500">MOBILE HERO</div>;
// }
