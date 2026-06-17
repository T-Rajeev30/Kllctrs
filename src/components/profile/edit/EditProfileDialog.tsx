"use client";

import { useState } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { createClient } from "@/lib/supabase/client";

import AvatarUploader from "./AvatarUploader";
import ProfileForm from "./ProfileForm";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}: EditProfileDialogProps) {
  const supabase = createClient();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile?.avatar_url ?? null,
  );

  // Card face shows the profile's last-saved values. It updates once the
  // dialog re-mounts with a fresh `profile` after save (the page reload
  // handles that), not live as the collector types.
  const cardName = profile?.display_name;
  const cardUsername = profile?.username;
  const cardYears = profile?.years_collecting ?? 0;
  const cardCategoryCount = profile?.favorite_categories?.length ?? 0;

  async function handleSave(data: any) {
    try {
      let avatarUrl = profile?.avatar_url;

      // Upload avatar if user selected one
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${profile.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, {
            upsert: true,
          });

        if (uploadError) {
          console.error("Upload Error:", uploadError);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: data.display_name,
          username: data.username,
          city: data.city,
          state: data.state,
          bio: data.bio,
          years_collecting: data.years_collecting,
          favorite_categories: data.favorite_categories,
          avatar_url: avatarUrl,
        })
        .eq("id", profile.id);

      if (error) {
        console.error(error);
        return;
      }

      onOpenChange(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          flex
          h-[85vh]
          max-h-[700px]
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-violet-100/60
          bg-white
          p-0
          shadow-2xl
          shadow-violet-500/20
        "
      >
        {/* Quiet top bar — the gradient lives in the card face panel now, not here */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-7 py-4">
          <DialogHeader>
            <DialogTitle className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Edit collector profile
            </DialogTitle>
            <DialogDescription className="sr-only">
              Update your display name, location, years collecting, favorite
              categories, and bio. Changes save to your collector profile.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
          {/* Card face — sticky identity preview, desktop only */}
          <div
            className="
              relative
              flex
              min-h-0
              w-full
              shrink-0
              flex-col
              items-center
              overflow-hidden
              bg-gradient-to-b
              from-[#241452]
              via-[#1a0a3d]
              to-[#150B30]
              px-8
              py-10
              md:w-[300px]
              md:overflow-y-auto
            "
          >
            <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-[#7c3aed]/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#E8B85C]/10 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center">
              <AvatarUploader
                avatarUrl={profile?.avatar_url}
                previewUrl={avatarPreview}
                onFileSelect={(file) => {
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />

              <div className="mt-6 text-center">
                <p className="text-lg font-bold text-white">
                  {cardName || "Your name"}
                </p>
                <p className="text-sm text-white/50">
                  @{cardUsername || "username"}
                </p>
              </div>

              <div className="mt-8 flex w-full flex-col gap-3 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E8B85C]" />
                    Collecting since
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {cardYears} yrs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed]" />
                    Specialties
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {cardCategoryCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form pane */}
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#FAF9FD] px-7 py-8 md:px-10">
            <ProfileForm
              initialData={{
                display_name: profile?.display_name,
                username: profile?.username,
                city: profile?.city,
                state: profile?.state,
                bio: profile?.bio,
                years_collecting: profile?.years_collecting,
                favorite_categories: profile?.favorite_categories ?? [],
              }}
              onSave={handleSave}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
