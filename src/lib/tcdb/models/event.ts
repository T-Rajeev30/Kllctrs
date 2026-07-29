export interface EventSource {

    provider:
    | "tcdb"
    | "sportscollectorsdigest";

    sourceId: string;

    sourceUrl: string;

    importedAt: string;

}

export interface EventVenue {

    name: string;

    address: string;

    city: string;

    state: string;

    zipCode: string;

    country: string;

    latitude?: number;

    longitude?: number;

}

export interface EventLinks {

    website?: string;

    facebook?: string;

    instagram?: string;

}

export interface EventValidation {

    valid: boolean;

    warnings: string[];

    errors: string[];

}

export interface CompleteEvent {

    source: EventSource;

    slug: string;

    title: string;

    description?: string;

    startDate: string;

    endDate: string;

    startTime?: string;

    endTime?: string;

    timezone?: string;

    venue: EventVenue;

    links: EventLinks;

    validation: EventValidation;

}