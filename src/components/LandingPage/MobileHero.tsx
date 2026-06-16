"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter, Unica_One } from "next/font/google";

const unica = Unica_One({
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function MobileHero() {
  return (
    <section className="relative w-full h-[637px] bg-[#FEF9FF] overflow-hidden">
      {/* Background Map */}
      <div className="absolute left-[-99px] top-[-25px] w-[576px] h-[471px]">
        <Image
          src="/hero_mobile.png"
          alt="Hobby Map"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="absolute left-[33px] top-[381px] w-[279px]">
        <div className="flex flex-col gap-4">
          <h1
            className={`${unica.className} text-[40px] leading-[40px] tracking-[-0.04em] text-black`}
          >
            Discover The
            <br />
            Hobby Near You
          </h1>

          <p
            className={`${inter.className} w-[213px] text-[12px] leading-[13px] tracking-[-0.02em] text-black`}
          >
            Explore card shows, local shops, and events near you. The most
            active hobby community, mapped in real time!
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/maps"
              className="w-[109px] h-[36px] bg-[#F0C040] rounded-[10px] flex items-center justify-center text-[14px] text-black"
            >
              Explore Map
            </Link>

            <Link
              href="/signup"
              className="w-[120px] h-[36px] bg-[#8B5CF6] border border-[#8B5CF6] rounded-[10px] flex items-center justify-center text-[14px] text-white"
            >
              Get Listed
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// "use client";
// export default function MobileHero() {
//   return (
//     <div className="fixed top-0 left-0 z-[9999] bg-red-500 text-white p-2">
//       MOBILE HERO
//     </div>
//   );
// }
