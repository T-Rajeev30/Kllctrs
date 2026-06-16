import type { Sponsor } from "@/types";

export function calculateTotalShows(
  sponsors: Sponsor[]
) {
  return sponsors.length;
}

export function trackSponsorClick(
  id: string
) {
  console.log("Clicked Sponsor:", id);
}