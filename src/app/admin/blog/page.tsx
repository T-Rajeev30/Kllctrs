import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminBlogClient from "../../../components/admin/AdminBlogClient";

export const metadata = { title: "Admin · Blog | KLLCTBLS" };

interface SearchParams {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminBlogPage({ searchParams }: SearchParams) {
  const { status } = await searchParams;
  const filterStatus = status ?? "draft";

  const { data: posts } = await supabaseAdmin
    .from("content")
    .select("*")
    .eq("type", "blog")
    .eq("status", filterStatus)
    .order("created_at", { ascending: false })
    .limit(100);

  // Recent approved events with no blog yet (for "Generate" button)
  const { data: events } = await supabaseAdmin
    .from("events")
    .select("id, name, date_start, city, state")
    .eq("status", "approved")
    .order("date_start", { ascending: true })
    .limit(20);

  return (
    <AdminBlogClient
      initialPosts={posts ?? []}
      availableEvents={events ?? []}
      currentStatus={filterStatus}
    />
  );
}
