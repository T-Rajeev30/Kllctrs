import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const state    = searchParams.get('state')
  const city     = searchParams.get('city')
  const keyword  = searchParams.get('keyword')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo   = searchParams.get('dateTo')

  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .order('date_start', { ascending: true })

  if (state)    query = query.eq('state', state)
  if (city)     query = query.ilike('city', `%${city}%`)
  if (keyword)  query = query.or(`name.ilike.%${keyword}%,venue_name.ilike.%${keyword}%,city.ilike.%${keyword}%`)
  if (dateFrom) query = query.gte('date_start', dateFrom)
  if (dateTo)   query = query.lte('date_start', dateTo)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ events: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const safe = {
    name: body.name,
    slug: body.slug,
    date_start: body.date_start,
    date_end: body.date_end || null,
    city: body.city,
    state: body.state,
    venue_name: body.venue_name || null,
    venue_address: body.venue_address || null,
    zip_code: body.zip_code || null,
    website: body.website || null,
    venue_website: body.venue_website || null,
    vendor_tables: body.vendor_tables || null,
    contact_name: body.contact_name || null,
    contact_phone: body.contact_phone || null,
    contact_email: body.contact_email || null,
    autograph_guests: body.autograph_guests || null,
    status: 'pending',
    submitted_by: user.id,
    source: 'user',
  }

  const { data, error } = await supabaseAdmin
    .from('events')
    .insert(safe)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ event: data }, { status: 201 })
}