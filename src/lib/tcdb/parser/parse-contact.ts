export interface ParsedContact {

    phone?: string;

    email?: string;

    website?: string;

}

export function parseContact(
    text: string
): ParsedContact {

    const phone =
        text.match(
            /\d{3}[-.\s]\d{3}[-.\s]\d{4}/
        );

    const email =
        text.match(
            /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
        );

    const website =
        text.match(
            /(https?:\/\/[^\s]+|www\.[^\s]+|[A-Za-z0-9.-]+\.(com|org|net))/i
        );

    return {

        phone: phone?.[0],

        email: email?.[0],

        website: website?.[0]

    };

}