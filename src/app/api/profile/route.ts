import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Build update object — only include fields that were sent
  const update: Record<string, any> = { updated_at: new Date().toISOString() };
  if ("display_name" in body) update.display_name = body.display_name ?? null;
  if ("city" in body) update.city = body.city ?? null;
  if ("state" in body) update.state = body.state ?? null;
  if ("favorite_categories" in body) update.favorite_categories = body.favorite_categories ?? [];
  if ("grading_preference" in body) update.grading_preference = body.grading_preference ?? null;
  if ("years_collecting" in body) update.years_collecting = body.years_collecting ?? null;
  if ("avatar_url" in body) update.avatar_url = body.avatar_url ?? null;

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}