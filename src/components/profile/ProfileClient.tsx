"use client";

import type { ProfileClientProps } from "@/lib/profile/types";

import ProfileHero from "./hero/ProfileHero";
import ProfileStats from "./stats/ProfileStats";
import SavedShops from "./shops/SavedShops";
import SavedEvents from "./events/SavedEvents";
export default function ProfileClient({
  user,
  profile,
  savedShops,
  savedEvents,
}: ProfileClientProps) {
  return (
    <main className="min-h-screen">
      <ProfileHero user={user} profile={profile} />

      {/* <ProfileStats
        savedShops={profile?.saved_shops?.length ?? 0}
        savedShows={profile?.saved_events?.length ?? 0}
      /> */}

      <div className="mx-auto mt-10 max-w-7xl px-6 pb-16">
        <SavedShops shops={savedShops} />
        <SavedEvents events={savedEvents} />
      </div>
    </main>
  );
}
