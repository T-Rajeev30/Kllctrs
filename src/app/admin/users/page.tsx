import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminUsersClient from "@/components/admin/AdminUsersClient";
import type { Profile } from "@/types";

export const metadata = { title: "Admin · Users | KLLCTRS" };

export default async function AdminUsersPage() {
  const { data: users } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  return <AdminUsersClient initialUsers={(users ?? []) as Profile[]} />;
}
