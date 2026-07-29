import { SportsCollectorRawEvent } from "../parser/sports-calendar-parser";
import { parseHeader } from "./parse-header";
import { parseShow } from "./parse-show-info";
import { parseContact } from "./parse-contact";

export function parseEvent(
    event: SportsCollectorRawEvent
) {

    const header =
        parseHeader(event.raw);

    if (!header)
        return null;

    const show =
        parseShow(header.remaining);

    const contact =
        parseContact(header.remaining);

    return {

        month: header.month,

        day: header.day,

        state: header.state,

        city: header.city,

        venue: show.venue,

        address: show.address,

        showHours: show.showHours,

        tables: show.tables,

        admission: show.admission,

        phone: contact.phone,

        email: contact.email,

        website: contact.website,

        raw: event.raw

    };

}