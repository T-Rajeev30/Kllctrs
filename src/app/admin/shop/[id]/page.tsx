import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import AdminShopEditClient from "@/components/admin/AdminShopEditClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: shop } = await supabaseAdmin
    .from("shops")
    .select("*")
    .eq("id", id)
    .single();

  if (!shop) notFound();

  return <AdminShopEditClient shop={shop} />;
}
