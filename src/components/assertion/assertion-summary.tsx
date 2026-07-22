import type { AssertionResult } from "@/types";

interface AssertionSummaryProps {
  results: AssertionResult[];
}

export function AssertionSummary({ results }: AssertionSummaryProps) {
  if (results.length === 0) {
    return null;
  }

  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;

  return (
    <span className="text-xs font-normal text-muted-foreground">
      (<span className="text-success">{passed} passed</span>
      {failed > 0 ? (
        <>
          , <span className="text-destructive">{failed} failed</span>
        </>
      ) : null}
      )
    </span>
  );
}
