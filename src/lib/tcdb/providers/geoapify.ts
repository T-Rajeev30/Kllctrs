export interface GeoapifyResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export class GeoapifyProvider {
  private readonly apiKey: string;

  constructor() {
    const key = process.env.GEOAPIFY_API_KEY;

    if (!key) {
      throw new Error("GEOAPIFY_API_KEY is missing.");
    }

    this.apiKey = key;
  }

  async geocode(address: string): Promise<GeoapifyResult> {
    const params = new URLSearchParams({
      text: address,
      apiKey: this.apiKey,
    });

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Geoapify request failed (${response.status})`
      );
    }

    const json = await response.json();

    if (
      !json.features ||
      json.features.length === 0
    ) {
      throw new Error(
        `No location found for ${address}`
      );
    }

    const feature = json.features[0];

    return {
      latitude: feature.properties.lat,
      longitude: feature.properties.lon,
      formattedAddress: feature.properties.formatted,
    };
  }
}