
import * as cheerio from "cheerio";

export function parseSportsCalendar(html: string) {
    const $ = cheerio.load(html);

    console.log("HTML Length:", html.length);

    console.log(
        "__NEXT_DATA__ Exists:",
        $("#__NEXT_DATA__").length
    );

    return [];
}

export function extractNextData(html: string): unknown {

    const match = html.match(
        /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
    );

    if (!match) {
        throw new Error("__NEXT_DATA__ not found");
    }

    return JSON.parse(match[1]);

}