import { createClient } from "@/lib/supabase/server";
import ContentHubClient from "@/components/content/ContentHubClient";

export const metadata = {
  title: "Content Hub | KLLCTRS",
  description: "AI-curated content for the trading card community.",
};

export default async function ContentHubPage() {
  const supabase = await createClient();

  const { data: content, error } = await supabase
    .from("content")
    .select(
      `
  id,
  title,
  slug,
  meta_description,
  published_at,
  updated_at,
  author,
  type,
  category
`,
    )

    .eq("status", "published")
    .order("published_at", {
      ascending: false,
    });

  if (error) {
    console.error("Error fetching content:", error);
  }

  return <ContentHubClient initialContent={content ?? []} />;
}
