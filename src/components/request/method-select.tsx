"use client";

import type { HttpMethod } from "@/types";
import { cn } from "@/utils/cn";
import { METHOD_TEXT_COLORS } from "@/utils/method-colors";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

interface MethodSelectProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

export function MethodSelect({ value, onChange }: MethodSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as HttpMethod)}
      aria-label="HTTP method"
      className={cn(
        "h-9 shrink-0 rounded-md border border-input bg-transparent px-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        METHOD_TEXT_COLORS[value]
      )}
    >
      {METHODS.map((method) => (
        <option key={method} value={method} className="text-foreground">
          {method}
        </option>
      ))}
    </select>
  );
}
