"use client";

import Link from "next/link";
import {
  Sparkles,
  Store,
  CalendarDays,
  BookOpen,
  Crown,
  ArrowRight,
} from "lucide-react";

import SectionCard from "../shared/SectionCard";

const actions = [
  {
    title: "AI Valuation",
    subtitle: "Value your latest card",
    href: "/tools/valuate",
    icon: Sparkles,
  },
  {
    title: "Browse Shops",
    subtitle: "Discover local stores",
    href: "/shops",
    icon: Store,
  },
  {
    title: "Shows",
    subtitle: "Upcoming events",
    href: "/shows",
    icon: CalendarDays,
  },
  {
    title: "Content Hub",
    subtitle: "Guides & articles",
    href: "/content",
    icon: BookOpen,
  },
  {
    title: "Go PRO",
    subtitle: "Unlock premium tools",
    href: "/pricing",
    icon: Crown,
    featured: true,
  },
];

export default function QuickActions() {
  return (
    <SectionCard className="p-6">
      <h2 className="mb-6 text-xl font-bold">Quick Actions</h2>

      <div className="space-y-3">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`
                group
                flex
                items-center
                justify-between
                rounded-2xl
                border
                p-4
                transition-all
                duration-300
                hover:scale-[1.02]

                ${
                  item.featured
                    ? "border-[#F0C040] bg-[#FFF9E8]"
                    : "border-[#ECE8F5] bg-white"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl

                    ${item.featured ? "bg-[#F0C040]" : "bg-[#6D3DF5]"}
                  `}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      item.featured ? "text-black" : "text-white"
                    }`}
                  />
                </div>

                <div>
                  <p className="font-semibold">{item.title}</p>

                  <p className="text-sm text-zinc-500">{item.subtitle}</p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}
