"use client";

import { useState } from "react";
import { Minus, Plus, MapPin } from "lucide-react";
import { State, City } from "country-state-city";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CategorySelector from "./CategorySelector";

interface ProfileFormProps {
  initialData?: {
    display_name?: string | null;
    username?: string | null;
    city?: string | null;
    state?: string | null;
    bio?: string | null;
    years_collecting?: number | null;
    favorite_categories?: string[];
  };

  onSave?: (data: {
    display_name: string;
    username: string;
    city: string;
    state: string;
    bio: string;
    years_collecting: number | null;
    favorite_categories: string[];
  }) => void | Promise<void>;

  onCancel?: () => void;
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5f2eea]">
        {label}
      </h3>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-zinc-600">
      {children}
    </label>
  );
}

// Shared trigger styling so Select matches Input's visual weight exactly —
// same height, radius, border color, and focus ring as every other field.
const selectTriggerClass = `
  h-11
  w-full
  rounded-xl
  border-zinc-200
  bg-white
  text-left
  text-sm
  font-normal
  text-zinc-900
  transition
  hover:border-violet-300
  focus:ring-2
  focus:ring-violet-100
  focus:ring-offset-0
  disabled:cursor-not-allowed
  disabled:opacity-60
  data-[placeholder]:text-zinc-400
`;

export default function ProfileForm({
  initialData,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(
    initialData?.display_name ?? "",
  );

  const [username, setUsername] = useState(initialData?.username ?? "");

  const [city, setCity] = useState(initialData?.city ?? "");

  const [stateName, setStateName] = useState(initialData?.state ?? "");

  const [yearsCollecting, setYearsCollecting] = useState<number | null>(
    initialData?.years_collecting ?? null,
  );

  const [categories, setCategories] = useState<string[]>(
    initialData?.favorite_categories ?? [],
  );

  const [bio, setBio] = useState(initialData?.bio ?? "");

  const [loading, setLoading] = useState(false);

  const usStates = State.getStatesOfCountry("US");

  const selectedState = usStates.find((state) => state.name === stateName);

  const cities = selectedState
    ? City.getCitiesOfState("US", selectedState.isoCode)
    : [];

  function adjustYears(delta: number) {
    setYearsCollecting((prev) => {
      const next = (prev ?? 0) + delta;
      return next < 0 ? 0 : next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!onSave) return;

    setLoading(true);

    try {
      await onSave({
        display_name: displayName,
        username,
        city,
        state: stateName,
        bio,
        years_collecting: yearsCollecting,
        favorite_categories: categories,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Identity */}
      <FieldGroup label="Identity">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel>Display Name</FieldLabel>

            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
              className="h-11 rounded-xl border-zinc-200 focus-visible:ring-violet-200"
            />
          </div>

          <div>
            <FieldLabel>Username</FieldLabel>

            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe"
              className="h-11 rounded-xl border-zinc-200 focus-visible:ring-violet-200"
            />
          </div>
        </div>
      </FieldGroup>

      {/* Location */}
      <FieldGroup label="Location">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* State */}
          <div>
            <FieldLabel>State</FieldLabel>

            <Select
              value={stateName}
              onValueChange={(value) => {
                setStateName(value);
                setCity("");
              }}
            >
              <SelectTrigger className={selectTriggerClass}>
                <span className="flex min-w-0 items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  <SelectValue placeholder="Select your state" />
                </span>
              </SelectTrigger>

              <SelectContent className="max-h-72 rounded-xl border-zinc-200">
                {usStates.map((state) => (
                  <SelectItem
                    key={state.isoCode}
                    value={state.name}
                    className="rounded-lg text-sm focus:bg-violet-50 focus:text-[#4a1fa8]"
                  >
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div>
            <FieldLabel>City</FieldLabel>

            <Select value={city} onValueChange={setCity} disabled={!stateName}>
              <SelectTrigger className={selectTriggerClass}>
                <span className="flex min-w-0 items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  <SelectValue
                    placeholder={
                      stateName ? "Select your city" : "Choose state first"
                    }
                  />
                </span>
              </SelectTrigger>

              <SelectContent className="max-h-72 rounded-xl border-zinc-200">
                {cities.map((cityItem) => (
                  <SelectItem
                    key={cityItem.name}
                    value={cityItem.name}
                    className="rounded-lg text-sm focus:bg-violet-50 focus:text-[#4a1fa8]"
                  >
                    {cityItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FieldGroup>

      {/* Collecting Since */}
      <FieldGroup label="Collecting Since">
        <div className="flex items-center gap-4">
          <div className="flex h-11 items-center rounded-xl border border-zinc-200 bg-white">
            <button
              type="button"
              onClick={() => adjustYears(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-l-xl text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-700"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <div className="flex w-16 items-baseline justify-center gap-1 px-1 tabular-nums">
              <span className="text-base font-semibold text-zinc-900">
                {yearsCollecting ?? 0}
              </span>

              <span className="text-xs text-zinc-400">yrs</span>
            </div>

            <button
              type="button"
              onClick={() => adjustYears(1)}
              className="flex h-11 w-11 items-center justify-center rounded-r-xl text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-700"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-xs text-zinc-400">
            How long you've been collecting cards
          </p>
        </div>
      </FieldGroup>

      <CategorySelector selected={categories} onChange={setCategories} />

      {/* Bio */}
      <FieldGroup label="About">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          placeholder="Tell the community about yourself and what you collect..."
          className="
            w-full
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-4
            text-sm
            leading-relaxed
            text-zinc-700
            outline-none
            transition
            placeholder:text-zinc-400
            focus:border-violet-300
            focus:ring-2
            focus:ring-violet-100
          "
        />
      </FieldGroup>

      {/* Footer */}
      <div
        className="
          flex
          flex-col-reverse
          gap-3
          border-t
          border-zinc-100
          pt-6
          sm:flex-row
          sm:justify-end
        "
      >
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="
            rounded-xl
            bg-gradient-to-r
            from-[#5f2eea]
            to-[#4a1fa8]
            px-7
            font-medium
            text-white
            shadow-[0_8px_24px_-6px_rgba(95,46,234,0.5)]
            transition
            hover:shadow-[0_10px_28px_-6px_rgba(95,46,234,0.6)]
            disabled:opacity-60
          "
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
