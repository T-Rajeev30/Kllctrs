import { searchEvents } from "../services/events";
import { searchShops } from "../services/shops";
import { searchSponsors } from "../services/sponsors";
import { searchEbayPrices } from "../services/ebay";


export async function executeTool(call: any) {
  let result: any = {};

  switch (call.name) {
    case "search_events":
  result = await searchEvents(call.args ?? {});

  return {
  result,
  count: result.total,
};

    case "search_shops":
  result = await searchShops(call.args ?? {});

  return {
  result,
  count: result.total,
};

    case "search_sponsors":
      result = await searchSponsors(call.args ?? {});
      return {
  result,
  count: result.total,
};

    case "search_ebay_prices":
      result = await searchEbayPrices(call.args ?? {});
      return {
  result,
  count: result.total,
};

    default:
return {
    result:{
        error:"Unknown tool"
    },
    count:0
}
  }
}