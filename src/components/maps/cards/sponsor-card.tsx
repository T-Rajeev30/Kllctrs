import { Card } from "@/components/ui/card";

export function SponsorCard() {
  return (
    <Card className="w-full">
      <h3 className="text-lg font-semibold text-[var(--text-main)]">
        PSA Grading
      </h3>

      <p className="text-sm text-[var(--text-muted)] mt-1">Grading company</p>
    </Card>
  );
}
