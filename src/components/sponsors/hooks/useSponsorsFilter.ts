import { useMemo } from "react";
import type { Sponsor } from "@/types";

interface Props {
  sponsors: Sponsor[];

  search: string;

  tierFilter: string;

  categoryFilter: string;

  sortBy: string;
}

export function useSponsorsFilter({
  sponsors,
  search,
  tierFilter,
  categoryFilter,
  sortBy,
}: Props) {
  return useMemo(() => {
    let result = [...sponsors];

    // -----------------------
    // Search
    // -----------------------

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((sponsor) => {
        return (
          sponsor.name.toLowerCase().includes(query) ||
          sponsor.slug.toLowerCase().includes(query) ||
          sponsor.category.toLowerCase().includes(query) ||
          sponsor.description?.toLowerCase().includes(query)
        );
      });
    }

    // -----------------------
    // Category Filter
    // -----------------------

    if (categoryFilter !== "all") {
      result = result.filter(
        (sponsor) => sponsor.category === categoryFilter
      );
    }

    // -----------------------
    // Tier Filter
    // (Currently not available in DB)
    // -----------------------

    if (tierFilter !== "all") {
      // Future implementation
      // Example:
      // result = result.filter(
      //   sponsor => sponsor.tier === tierFilter
      // );
    }

    // -----------------------
    // Sorting
    // -----------------------

    switch (sortBy) {
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at ?? "").getTime() -
            new Date(a.created_at ?? "").getTime()
        );
        break;

      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at ?? "").getTime() -
            new Date(b.created_at ?? "").getTime()
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    sponsors,
    search,
    tierFilter,
    categoryFilter,
    sortBy,
  ]);
}