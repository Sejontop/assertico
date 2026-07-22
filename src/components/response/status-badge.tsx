import { cn } from "@/utils/cn";
import { statusColorClassName } from "@/utils/status-color";

interface StatusBadgeProps {
  status: number;
  statusText: string;
}

export function StatusBadge({ status, statusText }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-sm font-semibold",
        statusColorClassName(status)
      )}
    >
      {status} {statusText}
    </span>
  );
}
