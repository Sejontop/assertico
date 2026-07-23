import type { LucideIcon } from "lucide-react";
import { GradientCard } from "@/components/gradient-card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <GradientCard className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]" />
      <div className="relative">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-white">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </GradientCard>
  );
}
