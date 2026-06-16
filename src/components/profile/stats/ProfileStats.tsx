"use client";

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

interface Props {
  savedShops: number;
  savedShows: number;
}

export default function ProfileStats({ savedShops, savedShows }: Props) {
  return (
    <SectionCard className="p-6 border rounded-xl">
      <h2>Stats</h2>
      <p>Saved Shops: {savedShops}</p>
      <p>Saved Shows: {savedShows}</p>
    </SectionCard>
  );
}
