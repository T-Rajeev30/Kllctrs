import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bookmark, Globe } from "lucide-react";

import type { Sponsor } from "@/types";

interface Props {
  sponsor: Sponsor;
}

interface ShowItem {
  day: string;
  month: string;
  title: string;
}

export default function SponsorUpcomingShows({ sponsor }: Props) {
  /*
    Replace this with your actual sponsor data when available.

    Example:

    const shows = sponsor.upcoming_shows ?? [];
  */

  const shows: ShowItem[] = [
    {
      day: "12",
      month: "May",
      title: "Dallas Card Show",
    },
    {
      day: "1",
      month: "Jun",
      title: "National Sports Collectors Convention",
    },
    {
      day: "30",
      month: "Oct",
      title: "Sunshine State Card Show",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Heading */}
      <h3 className="text-[12px] font-semibold leading-[15px] text-[#8B5CF6]">
        Next Shows
      </h3>

      {/* Show List */}
      <div className="flex flex-col gap-2">
        {shows.map((show, index) => (
          <div
            key={index}
            className="w-full rounded-[8px] bg-[#FEF9FF] px-3 py-[6px] flex items-center justify-between"
          >
            {/* Left */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Date */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[18px] leading-[22px] font-normal text-black">
                  {show.day}
                </span>

                <span className="text-[10px] leading-[12px] text-black">
                  {show.month}
                </span>
              </div>

              {/* Title */}
              <span className="text-[12px] leading-[15px] font-semibold text-black truncate max-w-[200px]">
                {show.title}
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4 shrink-0">
              <Bookmark
                size={16}
                strokeWidth={1.5}
                className="text-[#8B5CF6]"
              />

              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="text-[#8B5CF6]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* More Shows */}
        <button className="flex items-center gap-1 text-[10px] font-bold text-[#8B5CF6] hover:opacity-80 transition">
          +5 More Upcoming Shows
          <ArrowRight size={12} strokeWidth={1.5} />
        </button>

        {/* Website */}
        <Link
          href={sponsor.website ?? "#"}
          target="_blank"
          className="flex items-center gap-1 text-[10px] font-normal text-[#8B5CF6] hover:opacity-80 transition"
        >
          <Globe size={10} strokeWidth={1.5} />
          <span>Visit Website</span>
          <ArrowUpRight size={12} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
