import { normalizeEvent } from "../parser/event/normalize-event";
import type { DatabaseEvent } from "../models/database-event";
import type { ParsedSportsEvent } from "../parser/event/normalize-event";

export function buildSportsDatabaseEvent(
    event: ParsedSportsEvent
): DatabaseEvent {

    return normalizeEvent(event);

}

export function buildSportsDatabaseEvents(
    events: ParsedSportsEvent[]
): DatabaseEvent[] {

    return events.map(buildSportsDatabaseEvent);

}