import { SupabaseClient } from "@supabase/supabase-js";

import type { DatabaseEvent } from "../models/database-event";
import type { EventInsertRow } from "../types/supabase";

export class EventRepository {

  constructor(
    private readonly supabase: SupabaseClient
  ) {}

  //--------------------------------------------------
  // Create
  //--------------------------------------------------

  async create(
    row: EventInsertRow
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .insert(row)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Batch Create
  //--------------------------------------------------

  async createMany(
    rows: EventInsertRow[]
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .insert(rows)
        .select();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Exists By Source ID
  //--------------------------------------------------

  async existsBySourceId(
    provider: string,
    sourceId: string
  ): Promise<boolean> {

    const { count, error } =
      await this.supabase
        .from("events")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("source", provider)
        .eq(
          "metadata->>source_event_id",
          sourceId
        );

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;

  }

  //--------------------------------------------------
  // Exists By Hash
  //--------------------------------------------------

  async existsByHash(
    hash: string
  ): Promise<boolean> {

    const { count, error } =
      await this.supabase
        .from("events")
        .select("*", {
          head: true,
          count: "exact",
        })
        .eq("dedupe_hash", hash);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;

  }

  //--------------------------------------------------
  // Find By ID
  //--------------------------------------------------

  async findById(
    id: string
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Find By Slug
  //--------------------------------------------------

  async findBySlug(
    slug: string
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Update
  //--------------------------------------------------

  async update(
    id: string,
    updates: Partial<EventInsertRow>
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Delete
  //--------------------------------------------------

  async delete(
    id: string
  ) {

    const { error } =
      await this.supabase
        .from("events")
        .delete()
        .eq("id", id);

    if (error) {
      throw error;
    }

  }

  //--------------------------------------------------
  // Pending Events
  //--------------------------------------------------

  async pending() {

    const { data, error } =
      await this.supabase
        .from("events")
        .select("*")
        .eq("status", "pending")
        .order("date_start");

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Approved Events
  //--------------------------------------------------

  async approved() {

    const { data, error } =
      await this.supabase
        .from("events")
        .select("*")
        .eq("status", "approved")
        .order("date_start");

    if (error) {
      throw error;
    }

    return data;

  }
  async findBySourceId(
  provider: string,
  sourceEventId: string
) {
  const { data, error } = await this.supabase
    .from("events")
    .select("*")
    .eq("source", provider)
    .eq("source_event_id", sourceEventId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
async findByHash(
  hash: string
) {
  const { data, error } = await this.supabase
    .from("events")
    .select("*")
    .eq("dedupe_hash", hash)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
async findBySlugAndDate(
  slug: string,
  dateStart: string
) {
  const { data, error } = await this.supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("date_start", dateStart)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

}


