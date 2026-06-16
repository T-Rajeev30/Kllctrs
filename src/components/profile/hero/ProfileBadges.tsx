interface Props {
  categories: string[];
}

export default function ProfileBadges({ categories }: Props) {
  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <span
          key={category}
          className=" rounded-[10px] border border-[#5B18BE] bg-[rgba(64,14,138,0.20)] px-3 py-1 text-[11px]  text-[#F2EFFE]"
        >
          {category}
        </span>
      ))}
    </div>
  );
}
