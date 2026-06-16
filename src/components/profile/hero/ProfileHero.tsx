"use client";

import Image from "next/image";
import ProfileAvatar from "./ProfileAvatar";
import EditProfileButton from "../edit/EditProfileButton";
import { useState } from "react";
import EditProfileDialog from "../edit/EditProfileDialog";
interface Props {
  user: any;
  profile: any;
}

export default function ProfileHero({ user, profile }: Props) {
  const displayName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Collector";

  const [openEditProfile, setOpenEditProfile] = useState(false);

  const categories = profile?.favorite_categories?.length
    ? profile.favorite_categories
    : ["Pokemon", "Sports", "Vintage"];

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "2026";

  const isPro = user?.user_metadata?.subscription_tier === "pro_beta";

  return (
    <section className="relative overflow-hidden ">
      <div className="relative h-[340px] w-full">
        <Image
          src="/profile/ProfileHero.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-20 flex h-full items-center px-8 md:px-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <ProfileAvatar avatarUrl={profile?.avatar_url} />

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className=" text-4xl font-black uppercase  text-white">
                  {displayName}
                </h1>
                {isPro && (
                  <span className=" rounded-full  bg-[#F0C040] px-4 py-1 text-xs font-bold text-black ">
                    PRO
                  </span>
                )}
                <EditProfileButton onClick={() => setOpenEditProfile(true)} />

                <EditProfileDialog
                  open={openEditProfile}
                  onOpenChange={setOpenEditProfile}
                  profile={profile}
                />
                <EditProfileDialog
                  open={openEditProfile}
                  onOpenChange={setOpenEditProfile}
                  profile={profile}
                />
              </div>

              <p className="mt-2 text-white/90">
                Collecting since {memberSince}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((item: string) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/15 px-4 py-1 text-sm text-white backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
