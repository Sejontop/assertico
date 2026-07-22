"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DiffTreeView } from "@/components/diff/diff-tree-view";
import { DiffSummary } from "@/components/diff/diff-summary";
import { safeDiffResponses } from "@/lib/diff";
import type { DiffNode } from "@/lib/diff";

const PLACEHOLDER_A = '{\n  "id": 1,\n  "name": "Alice"\n}';
const PLACEHOLDER_B = '{\n  "id": 1,\n  "name": "Alicia"\n}';

const TEXTAREA_CLASSES =
  "h-64 w-full rounded-md border border-input bg-transparent p-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function DiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState<DiffNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = () => {
    const outcome = safeDiffResponses(left, right);
    if ("error" in outcome) {
      setError(outcome.error);
      setResult(null);
      return;
    }
    setError(null);
    setResult(outcome.diff);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="diff-left">
            Response A
          </label>
          <textarea
            id="diff-left"
            value={left}
            onChange={(event) => setLeft(event.target.value)}
            placeholder={PLACEHOLDER_A}
            spellCheck={false}
            className={TEXTAREA_CLASSES}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="diff-right">
            Response B
          </label>
          <textarea
            id="diff-right"
            value={right}
            onChange={(event) => setRight(event.target.value)}
            placeholder={PLACEHOLDER_B}
            spellCheck={false}
            className={TEXTAREA_CLASSES}
          />
        </div>
      </div>

      <Button type="button" onClick={handleCompare}>
        Compare
      </Button>

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-3 rounded-md border border-border bg-card p-4">
          <DiffSummary node={result} />
          <div className="overflow-auto rounded-md border border-border bg-background p-3">
            <DiffTreeView node={result} />
          </div>
        </div>
      ) : null}

      {!result && !error ? (
        <div className="rounded-md border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
          Paste two JSON responses above and click Compare to see what
          changed between them.
        </div>
      ) : null}
    </div>
  );
}
