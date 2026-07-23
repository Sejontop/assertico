"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyValueEditor } from "@/components/request/key-value-editor";
import { AssertionEditor } from "@/components/assertion/assertion-editor";
import { AssertionSummary } from "@/components/assertion/assertion-summary";
import { useKeyValuePairs } from "@/hooks/use-key-value-pairs";
import { useAssertions } from "@/hooks/use-assertions";
import { runAssertions } from "@/lib/assertion-engine";
import type { AssertionResult } from "@/types";

const BODY_TEXTAREA_CLASSES =
  "h-56 w-full rounded-md border border-input bg-transparent p-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function AssertionsPage() {
  const [status, setStatus] = useState("200");
  const [bodyText, setBodyText] = useState('{\n  "success": true,\n  "data": {\n    "id": 1\n  }\n}');

  const headers = useKeyValuePairs();
  const assertions = useAssertions();

  // Mirrors how the response proxy decides isJson: try to parse, and if it
  // fails, fall back to treating the body as a raw string. This lets
  // CONTAINS/REGEX/EQUALS still work against non-JSON bodies, same as the
  // real request/response flow.
  const parsedBody: unknown = useMemo(() => {
    try {
      return bodyText.trim().length > 0 ? JSON.parse(bodyText) : null;
    } catch {
      return bodyText;
    }
  }, [bodyText]);

  const headerRecord = useMemo(() => {
    return headers.pairs
      .filter((pair) => pair.enabled && pair.key.trim().length > 0)
      .reduce<Record<string, string>>((acc, pair) => {
        acc[pair.key] = pair.value;
        return acc;
      }, {});
  }, [headers.pairs]);

  const assertionResults: AssertionResult[] = useMemo(() => {
    const numericStatus = Number(status);
    return runAssertions(assertions.assertions, {
      status: Number.isFinite(numericStatus) ? numericStatus : 0,
      body: parsedBody,
      headers: headerRecord
    });
  }, [assertions.assertions, status, parsedBody, headerRecord]);

  const assertionResultsById = useMemo(
    () => new Map(assertionResults.map((result) => [result.id, result])),
    [assertionResults]
  );

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Assertions</h1>
        <p className="text-sm text-muted-foreground">
          Define assertions and test them against a response — paste a
          status, headers, and body below, or attach assertions directly to
          a request from the Requests page.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Mock response</h2>

          <div className="space-y-2">
            <Label htmlFor="status">Status code</Label>
            <Input
              id="status"
              type="number"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              placeholder="200"
              className="w-32 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label>Headers</Label>
            <KeyValueEditor
              pairs={headers.pairs}
              onAdd={headers.addPair}
              onUpdate={headers.updatePair}
              onToggle={headers.togglePair}
              onRemove={headers.removePair}
              keyPlaceholder="Header"
              emptyLabel="No headers yet."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <textarea
              id="body"
              value={bodyText}
              onChange={(event) => setBodyText(event.target.value)}
              spellCheck={false}
              className={BODY_TEXTAREA_CLASSES}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">Assertions</h2>
            <AssertionSummary results={assertionResults} />
          </div>
          <AssertionEditor
            assertions={assertions.assertions}
            results={assertionResultsById}
            onAdd={assertions.addAssertion}
            onUpdate={assertions.updateAssertion}
            onRemove={assertions.removeAssertion}
          />
        </div>
      </div>
    </div>
  );
}
