import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "../../components/profile/ProfileClient";

export const metadata = {
  title: "Profile | KLLCTRS",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  // Fetch profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
  }

  // Fetch saved shops
  let savedShops: any[] = [];

  if (profile?.saved_shops?.length) {
    const { data, error: shopsError } = await supabase
      .from("shops")
      .select("*")
      .in("id", profile.saved_shops);

    if (shopsError) {
      console.error(shopsError);
    }

    savedShops = data ?? [];
  }

  /////// events
  const savedEventIds = profile?.saved_events ?? [];

  const { data: savedEvents } =
    savedEventIds.length > 0
      ? await supabase.from("events").select("*").in("id", savedEventIds)
      : { data: [] };

  return (
    <ProfileClient
      user={user}
      profile={profile}
      savedShops={savedShops ?? []}
      savedEvents={savedEvents ?? []}
    />
  );
}
