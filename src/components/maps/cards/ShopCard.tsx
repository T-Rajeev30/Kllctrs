"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import type { Shop } from "@/types";

interface Props {
  shop: Shop;
  isSaved: boolean;
  savedShopIds: string[];
  setSavedShopIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ShopCard({
  shop,
  isSaved,
  savedShopIds,
  setSavedShopIds,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      let updated: string[];

      if (isSaved) {
        updated = savedShopIds.filter((id) => id !== shop.id);

        // Instant UI update
        setSavedShopIds(updated);

        const { error } = await supabase
          .from("profiles")
          .update({
            saved_shops: updated,
          })
          .eq("id", user.id);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Removed from Collection");
      } else {
        updated = [...savedShopIds, shop.id];

        // Instant UI update
        setSavedShopIds(updated);

        const { error } = await supabase
          .from("profiles")
          .update({
            saved_shops: updated,
          })
          .eq("id", user.id);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Added to Collection ✨", {
          description: shop.name,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const tags =
    typeof shop.specialty === "string"
      ? shop.specialty
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="w-full overflow-hidden rounded-[10px] border border-[#F2EFFE] bg-[#FEF9FF]">
      <div className="px-6 py-4">
        {/* Tags */}

        <div className="mb-3 flex flex-wrap justify-end gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#CBBEFB] bg-[#E5DFFD] px-3 py-1 text-[11px] text-[#8B5CF6]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}

        <h3 className="text-[20px] font-medium leading-[26px]">{shop.name}</h3>

        {/* Location */}

        <div className="mt-3 flex items-center gap-1 text-[11px]">
          <MapPin size={14} />
          {shop.city}, {shop.state}
        </div>
      </div>

      {/* Actions */}

      <div className="flex h-[39px]">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            flex flex-1 items-center justify-center gap-2
            rounded-bl-[10px]
            border border-[#F2EFFE]
            text-[12px]
            font-medium
            transition

            ${
              isSaved
                ? "bg-violet-50 text-violet-700"
                : "text-[#8B5CF6] hover:bg-[#F8F5FF]"
            }
          `}
        >
          {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}

          {saving ? "Saving..." : isSaved ? "Saved" : "Save"}
        </button>

        <button className="flex flex-1 items-center justify-center gap-2 border-y border-[#F2EFFE] text-[12px] font-medium text-[#8B5CF6]">
          <MessageSquare size={13} />
          Review
        </button>

        <a
          href={shop.website ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-br-[10px] border border-[#F2EFFE] text-[12px] font-medium text-[#8B5CF6]"
        >
          <Globe size={13} />
          Web
        </a>
      </div>
    </div>
  );
}
