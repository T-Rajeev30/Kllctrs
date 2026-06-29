export function formatSponsors(sponsors: any[]) {
  if (!sponsors || sponsors.length === 0) {
    return `
No sponsors were found.
`;
  }

  return `
Found ${sponsors.length} sponsors.

${sponsors
  .map(
    (sponsor, index) => `
Sponsor #${index + 1}

Name:
${sponsor.name}

Category:
${sponsor.category}

Description:
${sponsor.description ?? "No description"}

Website:
${sponsor.website ?? "Not available"}
`
  )
  .join("\n")}
`;
}