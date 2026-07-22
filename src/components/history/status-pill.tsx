import { cn } from "@/utils/cn";
import { statusColorClassName } from "@/utils/status-color";

interface StatusPillProps {
  status: number;
}

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-semibold",
        statusColorClassName(status)
      )}
    >
      {status}
    </span>
  );
}
