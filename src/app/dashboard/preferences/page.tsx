import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PreferencesClient from "../../dashboard/PreferencesClient";
import type { Profile } from "@/types";

export const metadata = { title: "Preferences | KLLCTBLS" };

export default async function PreferencesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <PreferencesClient profile={profile as Profile} />;
}
