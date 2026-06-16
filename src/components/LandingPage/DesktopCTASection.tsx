"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Unica_One } from "next/font/google";

const unica = Unica_One({
  weight: "400",
  subsets: ["latin"],
});

export default function CTASection() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-8">
      <div className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-[24px] lg:rounded-[32px] h-[430px] lg:h-[484px]">
        {/* Background Image */}
        <Image
          src="/cta-bg.svg" // Replace with your image
          alt="KLLCTRS CTA"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end lg:items-center justify-center">
          <div className="w-full max-w-[550px] px-6 pb-10 lg:pb-0 text-center">
            {/* Heading */}
            <h2
              className={`${unica.className} text-white text-[34px] leading-[0.95] sm:text-[48px] lg:text-[64px]`}
            >
              For People Who Never
              <br />
              Stopped Collecting.
            </h2>

            {/* Buttons */}
            <div className="mt-8 flex gap-3 justify-center">
              <Link href="/map" className="flex-1 max-w-[180px]">
                <Button
                  variant="gold"
                  className="h-12 w-full rounded-xl font-semibold"
                >
                  Explore Map
                </Button>
              </Link>

              <Link href="/shops/submit" className="flex-1 max-w-[180px]">
                <Button
                  variant="purple"
                  className="h-12 w-full rounded-xl font-semibold"
                >
                  Join KLLCTRS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
