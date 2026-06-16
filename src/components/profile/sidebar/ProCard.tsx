"use client";

import Link from "next/link";
import { ArrowRight, Crown, Sparkles, Zap, ShieldCheck } from "lucide-react";

import SectionCard from "../shared/SectionCard";

export default function ProCard() {
  return (
    <SectionCard className="overflow-hidden p-0">
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-indigo-700 to-purple-900" />

        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative p-6 text-white">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-300" />

            <h2 className="text-2xl font-bold">KLLCTRS PRO</h2>
          </div>

          <p className="mt-3 text-sm text-white/80">
            Unlock premium collector tools and AI-powered experiences.
          </p>

          <div className="mt-6 space-y-3">
            <Feature
              icon={<Sparkles className="h-4 w-4" />}
              text="Unlimited AI Valuations"
            />

            <Feature
              icon={<Zap className="h-4 w-4" />}
              text="Priority Features"
            />

            <Feature
              icon={<ShieldCheck className="h-4 w-4" />}
              text="Exclusive Member Benefits"
            />
          </div>

          <Link
            href="/pricing"
            className=" mt-6 flex items-center justify-center gap-2 rounded-xl  bg-white px-4 py-3 font-semibold  text-violet-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg "
          >
            Upgrade Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </SectionCard>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-white/10 p-2">{icon}</div>

      <span className="text-sm">{text}</span>
    </div>
  );
}
