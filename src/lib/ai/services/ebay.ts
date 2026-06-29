import { searchEbaySoldListings } from "@/lib/ebay";

export async function searchEbayPrices(args: any) {
  try {
    const items = await searchEbaySoldListings(
      args.query,
      8
    );

    const listings = items.map((item) => ({
      title: item.title,
      price: `${item.price.currency} ${item.price.value}`,
      condition:
        item.condition ?? "Unknown",
      url: item.itemWebUrl,
    }));

    return {
      listings,
      count: listings.length,
    };
  } catch (error: any) {
    

    return {
      listings: [],
      count: 0,
      error: error.message,
    };
    
  }
}