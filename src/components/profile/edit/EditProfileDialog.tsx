"use client";

import { useState } from "react";

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
          max-w-4xl
          rounded-[32px]
          overflow-hidden
          border-0
          bg-white
          p-0
        "
      >
        <div className="bg-gradient-to-r from-[#3F117F] via-[#5B18BE] to-[#7C3AED] px-10 py-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-white">
              Edit Profile
            </DialogTitle>

            <DialogDescription className="mt-2 text-white/80">
              Update your collector profile.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="bg-[#FAF9FD] px-10 py-8">
          <div className="mb-10 flex justify-center">
            <AvatarUploader
              avatarUrl={profile?.avatar_url}
              previewUrl={avatarPreview}
              onFileSelect={(file) => {
                setAvatarFile(file);

                setAvatarPreview(URL.createObjectURL(file));
              }}
            />
          </div>

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
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
