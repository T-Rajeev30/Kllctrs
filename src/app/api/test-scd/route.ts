import { NextResponse } from "next/server";
import { SportsCollectorDigestScraper } from "../../../lib/tcdb/services/sports-collector-digest-scrapper";

export async function GET() {
  const scraper = new SportsCollectorDigestScraper();

  const result = await scraper.scrape();

  return NextResponse.json(result);
}