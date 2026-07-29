/**
 * ------------------------------------------------------------
 * FILE: client.ts
 * PURPOSE:
 * Shared Supabase client for analytics queries.
 * Uses the service role key because these queries run
 * on the server inside API routes.
 * ------------------------------------------------------------
 */

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);