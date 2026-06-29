import * as cheerio from "cheerio";

export interface ParsedEventDetail {
  eventId: string;

  title: string;

  eventDate: string;

  startTime?: string;

  endTime?: string;

  venueName: string;

  streetAddress: string;

  city: string;

  state: string;

  zipCode: string;

  country: string;

  description?: string;

  website?: string;

  tcdbUrl: string;
}

const MONTHS: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

function convertDate(date: string): string {
  const match = date.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})/
  );

  if (!match) {
    return "";
  }

  const month = MONTHS[match[1]];
  const day = Number(match[2]);
  const year = Number(match[3]);

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseEventDetail(
  html: string
): ParsedEventDetail {

  const $ = cheerio.load(html);

  //------------------------------------
  // Canonical URL
  //------------------------------------

  const tcdbUrl =
    $('link[rel="canonical"]').attr("href") ?? "";

  //------------------------------------
  // Event ID
  //------------------------------------

  const idMatch = tcdbUrl.match(/ID=(\d+)/);

  const eventId = idMatch?.[1] ?? "";

  //------------------------------------
  // Title
  //------------------------------------

  const title =
    $("h3.site")
      .first()
      .text()
      .trim();

  //------------------------------------
  // Date + Time
  //------------------------------------

  const dateParagraph =
    $("h3.site")
      .first()
      .next("p")
      .text()
      .trim();

  /**
   * Saturday, June 13, 2026
   */

  const dateMatch = dateParagraph.match(
    /^[A-Za-z]+,\s(.+?)\s\(/,
  );

  const eventDate = dateMatch
    ? convertDate(dateMatch[1])
    : "";

  /**
   * 9:00 AM - 2:00 PM
   */

  const timeMatch = dateParagraph.match(
    /\((.*?)\)/,
  );

  let startTime = "";
  let endTime = "";

  if (timeMatch) {

    const split =
      timeMatch[1].split("-");

    startTime = split[0]?.trim() ?? "";

    endTime = split[1]?.trim() ?? "";

  }

  //------------------------------------
  // Venue
  //------------------------------------

  const venueParagraph =
    $("h3.site")
      .first()
      .nextAll("p")
      .eq(1);

  const htmlVenue =
    venueParagraph.html() ?? "";

  const lines =
    htmlVenue
      .split("<br>")
      .map(line =>
        cheerio.load(line).text().trim()
      )
      .filter(Boolean);

  const venueName =
    lines[0] ?? "";

  const streetAddress =
    lines[1] ?? "";

  let city = "";
  let state = "";
  let zipCode = "";
  let country = "";

  if (lines.length >= 3) {

    const cityMatch =
      lines[2].match(
        /^(.+?),\s([A-Z]{2})\s(\d+)/
      );

    if (cityMatch) {

      city = cityMatch[1];

      state = cityMatch[2];

      zipCode = cityMatch[3];

    }

  }

  if (lines.length >= 4) {

    country = lines[3];

  }

  //------------------------------------
  // Description
  //------------------------------------

  let description = "";

  $("p").each((_, p) => {

    const text =
      $(p).text();

    if (
      text.startsWith("Notes:")
    ) {

      description =
        text.replace(
          "Notes:",
          "",
        ).trim();

    }

  });

  //------------------------------------
  // Website
  //------------------------------------

  let website = "";

  $("a").each((_, a) => {

    const href =
      $(a).attr("href") ?? "";

    if (
      href.startsWith("http")
    ) {

      website = href;

    }

  });

  //------------------------------------

  return {

    eventId,

    title,

    eventDate,

    startTime,

    endTime,

    venueName,

    streetAddress,

    city,

    state,

    zipCode,

    country,

    description,

    website,

    tcdbUrl,

  };

}