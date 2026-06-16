"use client";

import Link from "next/link";
import { Crown, Store, CalendarDays, BookOpen } from "lucide-react";

import SectionCard from "../shared/SectionCard";

const links = [
  {
    title: "Become Pro",
    subtitle: "Unlock Exclusive Perks",
    href: "/pricing",
    icon: Crown,
    featured: true,
  },
  {
    title: "Browse Shops",
    subtitle: "124 Nearby Shops",
    href: "/shops",
    icon: Store,
  },
  {
    title: "Search Shows",
    subtitle: "50 Nearby Shows",
    href: "/shows",
    icon: CalendarDays,
  },
  {
    title: "Content Hub",
    subtitle: "News, guides and more",
    href: "/content",
    icon: BookOpen,
  },
];

export default function QuickLinks() {
  return (
    <SectionCard title="Quick Links" className="px-10 py-8">
      <div className="space-y-4">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`
                flex
                items-center
                gap-[34px]
                rounded-lg
                px-6
                py-3
                transition-all
                duration-200
                hover:-translate-y-[1px]

                ${
                  item.featured
                    ? `
                      border-2
                      border-[#F0C040]
                      bg-white
                      shadow-[0px_2px_2px_rgba(21,30,60,0.10)]
                    `
                    : `
                      border-2
                      border-[#F2EFFE]
                      bg-white
                      shadow-[0px_4px_4px_rgba(0,0,0,0.10)]
                    `
                }
              `}
            >
              {/* Icon */}

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B5CF6]">
                <Icon
                  className="h-[14px] w-[14px] text-white"
                  strokeWidth={2}
                />
              </div>

              {/* Text */}

              <div className="flex flex-col gap-1">
                <h3 className="text-[20px] font-semibold leading-6 text-black">
                  {item.title}
                </h3>

                <p className="text-[12px] leading-[15px] text-black">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}
