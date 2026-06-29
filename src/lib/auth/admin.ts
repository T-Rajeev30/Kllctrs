import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Returns the currently authenticated user.
 * Redirects to /login if no session exists.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
});

/**
 * Returns the user's profile from the profiles table.
 */
export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    throw new Error("Unable to load user profile.");
  }

  return data as AdminUser;
});

/**
 * Returns true if the logged-in user is an admin.
 */
export async function isAdmin() {
  const profile = await getCurrentProfile();

  return (
    profile.role === "admin" ||
    profile.role === "super_admin"
  );
}

/**
 * Protects an admin page.
 * Redirects non-admins back to the home page.
 */
export async function requireAdmin() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }
}

/**
 * Returns the admin profile.
 * Throws if the user is not an admin.
 */
export async function getAdmin() {
  const profile = await getCurrentProfile();

  if (
    profile.role !== "admin" &&
    profile.role !== "super_admin"
  ) {
    throw new Error("Unauthorized");
  }

  return profile;
}