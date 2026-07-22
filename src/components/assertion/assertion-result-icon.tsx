import { Check, X, Minus } from "lucide-react";
import type { AssertionResult } from "@/types";

interface AssertionResultIconProps {
  result?: AssertionResult;
}

export function AssertionResultIcon({ result }: AssertionResultIconProps) {
  if (!result) {
    return <Minus className="h-4 w-4 shrink-0 text-muted-foreground" aria-label="Not run yet" />;
  }

  return result.passed ? (
    <Check className="h-4 w-4 shrink-0 text-success" aria-label="Passed" />
  ) : (
    <X className="h-4 w-4 shrink-0 text-destructive" aria-label="Failed" />
  );
}
