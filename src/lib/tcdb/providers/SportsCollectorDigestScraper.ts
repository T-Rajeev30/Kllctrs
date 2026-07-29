export class SportsCollectorDigestScraper {

    private readonly BASE_URL =
        "https://sportscollectorsdigest.com/collecting-101/show-calendar";
    
    async scrape(): Promise<string> {

        const response = await fetch(this.BASE_URL, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        if (!response.ok) {
            throw new Error("Unable to download page.");
        }

        return response.text();
    }

}