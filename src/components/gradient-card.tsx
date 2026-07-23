import { cn } from "@/utils/cn";

interface GradientCardProps {
  className?: string;
  children: React.ReactNode;
}

export function GradientCard({ className, children }: GradientCardProps) {
  return <div className={cn("glass card-hover rounded-2xl p-6", className)}>{children}</div>;
}
