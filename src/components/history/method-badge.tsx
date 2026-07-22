import { cn } from "@/utils/cn";
import { METHOD_TEXT_COLORS } from "@/utils/method-colors";
import type { HttpMethod } from "@/types";

interface MethodBadgeProps {
  method: HttpMethod;
}

export function MethodBadge({ method }: MethodBadgeProps) {
  return (
    <span className={cn("font-mono text-xs font-semibold", METHOD_TEXT_COLORS[method])}>
      {method}
    </span>
  );
}
