export interface ParsedShow {

    title?: string;

    venue?: string;

    address?: string;

    showHours?: string;

    tables?: string;

    admission?: string;

    remaining: string;

}

export function parseShow(
    text: string
): ParsedShow {

    //----------------------------------
    // Show Hours
    //----------------------------------

    const hours =
        text.match(/SH:\s*(.*?)(?=T:|A:|Contact:|$)/);

    //----------------------------------
    // Tables
    //----------------------------------

    const tables =
        text.match(/T:\s*(.*?)(?=A:|Contact:|$)/);

    //----------------------------------
    // Admission
    //----------------------------------

    const admission =
        text.match(/A:\s*(.*?)(?=Contact:|$)/);

    //----------------------------------

    const firstSH = text.indexOf("SH:");

    const locationPart =
        firstSH > 0
            ? text.substring(0, firstSH)
            : text;

    const pieces =
        locationPart
            .split(",");

    return {

        venue: pieces[0]?.trim(),

        address: pieces
            .slice(1)
            .join(",")
            .trim(),

        showHours: hours?.[1]?.trim(),

        tables: tables?.[1]?.trim(),

        admission: admission?.[1]?.trim(),

        remaining: text

    };

}