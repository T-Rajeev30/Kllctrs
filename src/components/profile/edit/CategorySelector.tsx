"use client";

import { useEffect, useState } from "react";

interface CategorySelectorProps {
  selected?: string[];
  onChange?: (categories: string[]) => void;
}

const ALL_CATEGORIES = [
  "Pokemon",
  "Sports",
  "Vintage",
  "Marvel",
  "NBA",
  "NFL",
  "Soccer",
  "Magic",
  "Yu-Gi-Oh!",
  "One Piece",
  "Baseball",
  "Hockey",
  "Anime",
  "Formula 1",
  "Cricket",
];

export default function CategorySelector({
  selected = [],
  onChange,
}: CategorySelectorProps) {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(selected);

  useEffect(() => {
    setSelectedCategories(selected);
  }, [selected]);

  function toggleCategory(category: string) {
    let updated: string[];

    if (selectedCategories.includes(category)) {
      updated = selectedCategories.filter((item) => item !== category);
    } else {
      updated = [...selectedCategories, category];
    }

    setSelectedCategories(updated);
    onChange?.(updated);
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Favourite Categories
        </h3>

        <p className="mt-1 text-xs text-zinc-500">Select all that apply.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {ALL_CATEGORIES.map((category) => {
          const active = selectedCategories.includes(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-medium
                transition-all
                duration-200

                ${
                  active
                    ? `
                      border-[#5B18BE]
                      bg-[#5B18BE]
                      text-white
                      shadow-md
                    `
                    : `
                      border-zinc-200
                      bg-white
                      text-zinc-700
                      hover:border-violet-300
                      hover:bg-violet-50
                    `
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
