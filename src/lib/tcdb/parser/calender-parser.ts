import * as cheerio from "cheerio";

import type { ParsedCalendarEvent } from "../types";

interface CalendarHeader {
  month: number;
  year: number;
}

function parseCalendarHeader($: cheerio.CheerioAPI): CalendarHeader {
  const header = $("table.table-bordered tr:first-child td")
    .text()
    .trim();

  // Example:
  // June 2026

  const match = header.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/
  );

  if (!match) {
    throw new Error("Unable to determine month/year.");
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    month: months.indexOf(match[1]) + 1,
    year: Number(match[2]),
  };
}

export function parseCalendar(
  html: string
): ParsedCalendarEvent[] {

  const $ = cheerio.load(html);

  const events: ParsedCalendarEvent[] = [];

  const { month, year } = parseCalendarHeader($);

  $("table.table-bordered td").each((_, cell) => {

    const td = $(cell);

    //------------------------------------
    // Day
    //------------------------------------

    const dayText = td
      .find("font")
      .first()
      .text()
      .trim();

    const day = Number(dayText);

    if (!day) return;

    //------------------------------------
    // Every event is inside a <p>
    //------------------------------------

    td.find("p").each((_, paragraph) => {

      const p = $(paragraph);

      const link = p.find("a");

      if (!link.length) return;

      //------------------------------------
      // URL
      //------------------------------------

      const href = link.attr("href") ?? "";

      //------------------------------------
      // Event ID
      //------------------------------------

      const idMatch = href.match(/ID=(\d+)/);

      const eventId = idMatch?.[1] ?? "";

      //------------------------------------
      // Title
      //------------------------------------

      const rawTitle = link.text().trim();

      // Remove time

      const title = rawTitle.replace(
        /^\d{1,2}:\d{2}\s?(AM|PM)\s*-\s*\d{1,2}:\d{2}\s?(AM|PM)\s*-\s*/i,
        ""
      );

      //------------------------------------
      // Time
      //------------------------------------

      const timeMatch = rawTitle.match(
        /(\d{1,2}:\d{2}\s?(AM|PM))\s*-\s*(\d{1,2}:\d{2}\s?(AM|PM))/i
      );

      const startTime = timeMatch?.[1] ?? "";

      const endTime = timeMatch?.[3] ?? "";

      //------------------------------------
      // Location
      //------------------------------------

      const locationMatch = p
        .text()
        .match(/\(([^,]+),\s*([A-Z]{2})\)/);

      const city = locationMatch?.[1] ?? "";

      const state = locationMatch?.[2] ?? "";

      //------------------------------------
      // Date
      //------------------------------------

      const date = new Date(
        year,
        month - 1,
        day
      );

      const formattedDate = date
        .toISOString()
        .split("T")[0];

      //------------------------------------

      events.push({

        id: eventId,

        eventId,

        title,

        eventUrl: `https://www.tcdb.com${href}`,

        city,

        state,

        startDate: formattedDate,

        endDate: formattedDate,

        startTime,

        endTime,

      });

    });

  });

  return events;

}