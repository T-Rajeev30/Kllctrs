/**
 * ------------------------------------------------------------
 * FILE: SummaryCards.tsx
 * PURPOSE:
 * Displays the dashboard KPI cards using the reusable StatCard component.
 * ------------------------------------------------------------
 */

import { Eye, Globe, MapPinned, Building2 } from "lucide-react";

import { SummaryStats } from "@/types/analytics";

import StatCard from "./StatCard";

interface SummaryCardsProps {
  summary: SummaryStats;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Views",
      value: summary.totalViews,
      subtitle: "All page visits",
      icon: <Eye size={28} />,
      trend: {
        value: "+12%",
        positive: true,
      },
    },
    {
      title: "Countries",
      value: summary.uniqueCountries,
      subtitle: "Unique countries",
      icon: <Globe size={28} />,
      trend: {
        value: "+3",
        positive: true,
      },
    },
    {
      title: "States",
      value: summary.uniqueStates,
      subtitle: "Unique states",
      icon: <MapPinned size={28} />,
      trend: {
        value: "+7",
        positive: true,
      },
    },
    {
      title: "Cities",
      value: summary.uniqueCities,
      subtitle: "Unique cities",
      icon: <Building2 size={28} />,
      trend: {
        value: "+18",
        positive: true,
      },
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value.toLocaleString()}
          subtitle={card.subtitle}
          icon={card.icon}
          trend={card.trend}
        />
      ))}
    </div>
  );
}
