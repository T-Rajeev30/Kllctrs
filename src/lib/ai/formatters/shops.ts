export function formatShops(shops: any[]) {
  if (!shops || shops.length === 0) {
    return `
No card shops were found.

Tell the user no matching shops exist and suggest searching another city.
`;
  }

  return `
Found ${shops.length} card shops.

${shops
  .map(
    (shop, index) => `
Shop #${index + 1}

Name:
${shop.name}

Location:
${shop.city}, ${shop.state}

Specialty:
${shop.specialty ?? "General"}

Address:
${shop.address ?? "Unknown"}

Phone:
${shop.phone ?? "Not available"}

Website:
${shop.website ?? "Not available"}
`
  )
  .join("\n")}
`;
}