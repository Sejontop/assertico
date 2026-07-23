import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface DashboardCardProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  accentClassName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function DashboardCard({
  icon: Icon,
  label,
  value,
  accentClassName,
  className,
  style
}: DashboardCardProps) {
  return (
    <div className={cn("glass-strong rounded-xl p-4 shadow-lg", className)} style={style}>
      <div className="flex items-center gap-2">
        {Icon ? <Icon className={cn("h-4 w-4", accentClassName ?? "text-primary")} /> : null}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
