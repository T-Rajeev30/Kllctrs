import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { searchEbaySoldListings } from '@/lib/ebay'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

// Tool definitions — Gemini decides when to call these
const tools = [{
  functionDeclarations: [
    {
      name: 'search_events',
      description: 'Search for upcoming sports card shows / events. Use when user asks about card shows, conventions, expos, or trade events.',
      parameters: {
        type: 'object',
        properties: {
          state:    { type: 'string', description: '2-letter US state code, e.g. TX, CA, NY' },
          city:     { type: 'string', description: 'City name' },
          keyword:  { type: 'string', description: 'Search keyword for event name or venue' },
          dateFrom: { type: 'string', description: 'Start date YYYY-MM-DD (inclusive)' },
          dateTo:   { type: 'string', description: 'End date YYYY-MM-DD (inclusive)' },
        },
      },
    },
    {
      name: 'search_shops',
      description: 'Search for card shops / trading card stores. Use when user asks where to buy/sell cards locally.',
      parameters: {
        type: 'object',
        properties: {
          state:     { type: 'string', description: '2-letter US state code' },
          city:      { type: 'string', description: 'City name' },
          specialty: { type: 'string', enum: ['sports', 'pokemon', 'both'], description: 'sports for sports cards, pokemon for TCG, both for shops carrying both' },
          keyword:   { type: 'string', description: 'Shop name search' },
        },
      },
    },
    {
      name: 'search_sponsors',
      description: 'Search for industry sponsors and services like grading companies (PSA, Beckett, SGC), auction houses (Heritage, Goldin), manufacturers (Topps, Panini), or marketplaces. Use when user asks about grading, auctions, breaks, or specific company names.',
      parameters: {
        type: 'object',
        properties: {
          category: { type: 'string', description: 'e.g. grading, auction, manufacturer, marketplace, breaks' },
          keyword:  { type: 'string', description: 'Company name search' },
        },
      },
    },
    {
      name: 'search_ebay_prices',
      description: 'Search recent eBay listings to find current market prices for trading cards or sports memorabilia. Use when users ask about card values, prices, or what something is selling for.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Specific search query for eBay, e.g. "2018 Patrick Mahomes Donruss Optic Rated Rookie", "Charizard 1st Edition Holo PSA 9", "Topps Chrome Update 2023"',
          },
        },
        required: ['query'],
      },
    },
  ],
}]

// Tool implementations
async function searchEvents(args: any) {
  let q = supabaseAdmin
    .from('events').select('name, slug, date_start, date_end, city, state, venue_name, website')
    .eq('status', 'approved')
    .order('date_start', { ascending: true })
    .limit(10)

  if (args.state)    q = q.eq('state', args.state.toUpperCase())
  if (args.city)     q = q.ilike('city', `%${args.city}%`)
  if (args.keyword)  q = q.or(`name.ilike.%${args.keyword}%,venue_name.ilike.%${args.keyword}%`)
  if (args.dateFrom) q = q.gte('date_start', args.dateFrom)
  if (args.dateTo)   q = q.lte('date_start', args.dateTo)

  const { data } = await q
  return { events: data ?? [] }
}

async function searchShops(args: any) {
  let q = supabaseAdmin
    .from('shops').select('name, slug, city, state, specialty, address, phone, website')
    .eq('status', 'approved')
    .limit(10)

  if (args.state)     q = q.eq('state', args.state.toUpperCase())
  if (args.city)      q = q.ilike('city', `%${args.city}%`)
  if (args.specialty) q = q.eq('specialty', args.specialty)
  if (args.keyword)   q = q.ilike('name', `%${args.keyword}%`)

  const { data } = await q
  return { shops: data ?? [] }
}

async function searchSponsors(args: any) {
  let q = supabaseAdmin
    .from('sponsors').select('name, slug, category, description, website')
    .limit(10)

  if (args.category) q = q.ilike('category', `%${args.category}%`)
  if (args.keyword)  q = q.ilike('name', `%${args.keyword}%`)

  const { data } = await q
  return { sponsors: data ?? [] }
}
async function searchEbayPrices(args: any) {
  try {
    const items = await searchEbaySoldListings(args.query, 8)
    const summary = items.map(i => ({
      title: i.title,
      price: `${i.price.currency} ${i.price.value}`,
      condition: i.condition ?? 'Unknown',
      url: i.itemWebUrl,
    }))
    return { listings: summary, count: summary.length }
  } catch (e: any) {
    return { listings: [], count: 0, error: e.message }
  }
}

const SYSTEM_PROMPT = `You are KLLCTBLS Assistant — a helpful AI for sports card collectors.

Today is ${new Date().toISOString().split('T')[0]}.

You help users find:
- Card shows / trade events near them
- Card shops / trading card stores
- Industry sponsors (grading, auctions, manufacturers)

Rules:
1. Use the provided tools to fetch live data — never make up event names, dates, or locations.
2. For card prices/values, use the search_ebay_prices tool. Show 3-5 recent listings with title, price, and condition. Mention they're current asking prices, not guaranteed sold prices. Always include links so users can click through.
3. Keep responses concise — bullet points for lists, plain prose for short answers.
4. Always cite specific events/shops/sponsors by name when you find them.
5. If a tool returns no results, say so honestly and suggest broader filters.
6. Format dates as "Mar 15, 2026" not ISO.
7. Never invent URLs. Only use websites from tool responses.`

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { message, history = [] } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Empty message' }, { status: 400 })
    }

    const contents = [
      ...history.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    let response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents,
      config: { tools, systemInstruction: SYSTEM_PROMPT },
    })

    const sources: any[] = []
    let safety = 0

    while (response.functionCalls && response.functionCalls.length > 0 && safety < 5) {
      safety++
      const fnResponses: any[] = []

      for (const call of response.functionCalls) {
        let result: any = {}
        if (call.name === 'search_events')      result = await searchEvents(call.args ?? {})
        if (call.name === 'search_shops')       result = await searchShops(call.args ?? {})
        if (call.name === 'search_sponsors')    result = await searchSponsors(call.args ?? {})
        if (call.name === 'search_ebay_prices') result = await searchEbayPrices(call.args ?? {})

        sources.push({
          tool: call.name,
          args: call.args,
          count: result.events?.length ?? result.shops?.length ?? result.sponsors?.length ?? result.listings?.length ?? 0,
        })

        fnResponses.push({
          functionResponse: { name: call.name!, response: result },
        })
      }

      contents.push({ role: 'model', parts: response.functionCalls.map(c => ({ functionCall: c })) } as any)
      contents.push({ role: 'user', parts: fnResponses } as any)

      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents,
        config: { tools, systemInstruction: SYSTEM_PROMPT },
      })
    }
    // Extract text from candidates if response.text is missing
    let text = response.text
    if (!text) {
      const parts = response.candidates?.[0]?.content?.parts ?? []
      text = parts.map((p: any) => p.text ?? '').filter(Boolean).join('\n').trim()
    }
    if (!text) text = 'Sorry, I could not generate a response.'
    
    await supabaseAdmin.from('chat_conversations').insert({
      user_id: user?.id ?? null,
      user_message: message,
      bot_response: text,
      sources,
    })

    return NextResponse.json({ response: text, sources })
  } catch (e: any) {
    console.error('[chat] error:', e)
    return NextResponse.json({ error: e.message ?? 'Chat failed' }, { status: 500 })
  }
}