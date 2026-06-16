import { SearchX } from "lucide-react";

export default function EmptySponsors() {
  return (
    <section className="w-full py-20">
      <div className="mx-auto flex max-w-7xl justify-center px-6">
        <div className="flex w-full max-w-[520px] flex-col items-center justify-center rounded-[24px] border border-[#E8E2FF] bg-white px-8 py-14 shadow-sm">
          {/* Icon */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F6F2FF]">
            <SearchX size={38} strokeWidth={1.75} className="text-[#8B5CF6]" />
          </div>

          {/* Title */}
          <h2 className="text-center text-[28px] font-semibold text-[#151E3C]">
            No Sponsors Found
          </h2>

          {/* Description */}
          <p className="mt-4 max-w-md text-center text-[15px] leading-7 text-[#6B7280]">
            We couldn't find any sponsors matching your current search or
            selected filters.
          </p>

          {/* Hint */}
          <div className="mt-8 rounded-full border border-[#D9CCFF] bg-[#FEF9FF] px-5 py-2 text-[13px] text-[#8B5CF6]">
            Try changing your search or selecting another category.
          </div>
        </div>
      </div>
    </section>
  );
}
