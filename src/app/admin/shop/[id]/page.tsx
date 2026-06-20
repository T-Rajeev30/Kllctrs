// import { supabaseAdmin } from "@/lib/supabase/admin";
// import { notFound } from "next/navigation";
// import AdminShopEditClient from "@/components/admin/AdminShopEditClient";

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   const { data: shop } = await supabaseAdmin
//     .from("shops")
//     .select("*")
//     .eq("id", id)
//     .single();

//   if (!shop) notFound();

//   return <AdminShopEditClient shop={shop} />;
// }

// import { supabaseAdmin } from "@/lib/supabase/admin";
// import { notFound } from "next/navigation";
// import AdminShopEditClient from "@/components/admin/AdminShopEditClient";

// const { id } = await params;

// console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
// console.log("SERVICE ROLE EXISTS:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

// const { data: shop, error } = await supabaseAdmin
//   .from("shops")
//   .select("*")
//   .eq("id", id)
//   .single();

// console.log("SHOP:", shop);
// console.log("ERROR:", error);

import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import AdminShopEditClient from "@/components/admin/AdminShopEditClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("SERVICE ROLE EXISTS:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: shop, error } = await supabaseAdmin
    .from("shops")
    .select("*")
    .eq("id", id)
    .single();

  console.log("SHOP:", shop);
  console.log("ERROR:", error);

  if (!shop) notFound();

  return <AdminShopEditClient shop={shop} />;
}
