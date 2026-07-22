"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssertionRow } from "@/components/assertion/assertion-row";
import type { AssertionDefinition, AssertionResult } from "@/types";

interface AssertionEditorProps {
  assertions: AssertionDefinition[];
  results: Map<string, AssertionResult>;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<Omit<AssertionDefinition, "id">>) => void;
  onRemove: (id: string) => void;
}

export function AssertionEditor({
  assertions,
  results,
  onAdd,
  onUpdate,
  onRemove
}: AssertionEditorProps) {
  return (
    <div className="space-y-2">
      {assertions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No assertions yet. Add one to validate the response automatically
          every time you send this request.
        </p>
      ) : null}

      {assertions.map((assertion) => (
        <AssertionRow
          key={assertion.id}
          assertion={assertion}
          result={results.get(assertion.id)}
          onChange={(patch) => onUpdate(assertion.id, patch)}
          onRemove={() => onRemove(assertion.id)}
        />
      ))}

      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Add assertion
      </Button>
    </div>
  );
}
