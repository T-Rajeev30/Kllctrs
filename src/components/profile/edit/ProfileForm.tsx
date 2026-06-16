"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
}

export default function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(
    initialData?.display_name ?? "",
  );

  const [username, setUsername] = useState(initialData?.username ?? "");

  const [city, setCity] = useState(initialData?.city ?? "");

  const [stateName, setStateName] = useState(initialData?.state ?? "");

  const [yearsCollecting, setYearsCollecting] = useState(
    initialData?.years_collecting?.toString() ?? "",
  );
  const [categories, setCategories] = useState<string[]>(
    initialData?.favorite_categories ?? [],
  );
  const [bio, setBio] = useState(initialData?.bio ?? "");

  const [loading, setLoading] = useState(false);

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
        years_collecting:
          yearsCollecting.trim() === "" ? null : Number(yearsCollecting),
        favorite_categories: categories,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Display Name + Username */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-800">
            Display Name
          </label>

          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="John Doe"
            className="h-11 rounded-xl"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-800">
            Username
          </label>

          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@john_doe"
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      {/* City + State */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-800">
            City
          </label>

          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Bangalore"
            className="h-11 rounded-xl"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-800">
            State
          </label>

          <Input
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            placeholder="Karnataka"
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      {/* Years */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-800">
          Years Collecting
        </label>

        <Input
          type="number"
          value={yearsCollecting}
          onChange={(e) => setYearsCollecting(e.target.value)}
          placeholder="5"
          className="h-11 rounded-xl"
        />
      </div>
      <CategorySelector selected={categories} onChange={setCategories} />
      {/* Bio */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-800">
          Bio
        </label>

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          placeholder="Tell the community about yourself..."
          className="
            w-full
            rounded-2xl
            border
            border-zinc-200
            bg-white
            p-4
            text-sm
            outline-none
            transition
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-200
          "
        />
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-zinc-200 pt-6">
        <Button type="button" variant="outline">
          Cancel
        </Button>

        <Button
          type="submit"
          variant="purple"
          disabled={loading}
          className="px-8"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
