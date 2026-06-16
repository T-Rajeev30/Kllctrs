"use client";

import SectionCard from "../shared/SectionCard";

export default function DailyPicks() {
  return (
    <SectionCard title="Daily Picks" className="p-6">
      <div className="rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 p-8 text-center">
        <h3 className="text-xl font-bold">AI Daily Picks</h3>

        <p className="mt-2 text-zinc-600">
          Personalized recommendations coming soon.
        </p>
      </div>
    </SectionCard>
  );
}
