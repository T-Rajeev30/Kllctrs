import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminShopManagerClient from "@/components/admin/AdminShopManagerClient";

export default async function ShopManagerPage() {
  const { data: shops } = await supabaseAdmin
    .from("shops")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1000);

  return <AdminShopManagerClient initialShops={shops ?? []} />;
}
