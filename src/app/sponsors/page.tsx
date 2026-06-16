import SponsorsClient from "@/components/sponsors/SponsorsClients";
import { createClient } from "@/lib/supabase/server";
import type { Sponsor } from "@/types";

export default async function SponsorsPage() {
  const supabase = await createClient();

  const { data } = await supabase.from("sponsors").select("*").order("name");

  return <SponsorsClient initialSponsors={(data ?? []) as Sponsor[]} />;
}
