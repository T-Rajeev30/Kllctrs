interface SponsorStatBoxProps {
  title?: string;
  left?: number;
  total?: number;
}

export default function SponsorStatBox({
  title = "this year",
  left = 8,
  total = 20,
}: SponsorStatBoxProps) {
  return (
    <div className="box-border flex flex-col justify-center items-center w-[120px] h-[77px] p-3 gap-2 border border-[#CBBEFB] rounded-[8px] bg-white shrink-0">
      {/* this year */}
      <p className="w-full text-center text-[10px] leading-[12px] font-normal text-black">
        {title}
      </p>

      {/* numbers */}
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        {/* left */}
        <div className="flex flex-col justify-center items-center flex-1">
          <span className="w-full text-center text-[18px] leading-[22px] font-normal text-black">
            {left}
          </span>

          <span className="w-full text-center text-[10px] leading-[12px] font-normal text-black">
            left
          </span>
        </div>

        {/* total */}
        <div className="flex flex-col justify-center items-center flex-1">
          <span className="w-full text-center text-[18px] leading-[22px] font-normal text-black">
            {total}
          </span>

          <span className="w-full text-center text-[10px] leading-[12px] font-normal text-black">
            total
          </span>
        </div>
      </div>
    </div>
  );
}
