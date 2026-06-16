import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface AppButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "gold" | "purple";
  arrow?: boolean;
}

export function AppButton({
  href,
  children,
  variant = "gold",
  arrow = false,
}: AppButtonProps) {
  return (
    <Link href={href}>
      <Button variant={variant} className="h-12 px-8 rounded-xl font-semibold">
        {children}
        {arrow && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </Link>
  );
}
