import type { Sponsor } from "@/types";

import SponsorsCard from "./SponsorsCard";

interface Props {
  sponsors: Sponsor[];
}

export default function SponsorsGrid({ sponsors }: Props) {
  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <SponsorsCard key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      </div>
    </section>
  );
}
