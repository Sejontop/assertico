"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AssertionResultIcon } from "@/components/assertion/assertion-result-icon";
import {
  ASSERTION_OPERATOR_LABELS,
  ASSERTION_TYPE_LABELS
} from "@/utils/assertion-labels";
import type {
  AssertionDefinition,
  AssertionOperator,
  AssertionResult,
  AssertionType
} from "@/types";

interface AssertionRowProps {
  assertion: AssertionDefinition;
  result?: AssertionResult;
  onChange: (patch: Partial<Omit<AssertionDefinition, "id">>) => void;
  onRemove: () => void;
}

const TYPES: AssertionType[] = ["STATUS", "BODY", "HEADER", "RESPONSE_TIME"];
const OPERATORS: AssertionOperator[] = [
  "EQUALS",
  "NOT_EQUALS",
  "CONTAINS",
  "EXISTS",
  "GREATER_THAN",
  "LESS_THAN",
  "REGEX"
];

export function AssertionRow({ assertion, result, onChange, onRemove }: AssertionRowProps) {
  const needsPath = assertion.type === "BODY" || assertion.type === "HEADER";

  return (
    <div className="flex items-start gap-2">
      <div className="flex h-9 items-center">
        <AssertionResultIcon result={result} />
      </div>

      <select
        value={assertion.type}
        onChange={(event) => {
          const nextType = event.target.value as AssertionType;
          onChange({
            type: nextType,
            path: nextType === "BODY" || nextType === "HEADER" ? assertion.path : null,
            operator: nextType === "RESPONSE_TIME" ? "LESS_THAN" : assertion.operator,
            expectedValue: nextType === "RESPONSE_TIME" ? "200" : assertion.expectedValue
          });
        }}
        className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
      >
        {TYPES.map((type) => (
          <option key={type} value={type}>
            {ASSERTION_TYPE_LABELS[type]}
          </option>
        ))}
      </select>

      <Input
        value={assertion.path ?? ""}
        onChange={(event) => onChange({ path: event.target.value })}
        placeholder={
          assertion.type === "HEADER"
            ? "content-type"
            : assertion.type === "RESPONSE_TIME"
              ? "N/A"
              : "data.user.id"
        }
        disabled={!needsPath}
        className="flex-1 font-mono"
      />

      <select
        value={assertion.operator}
        onChange={(event) => onChange({ operator: event.target.value as AssertionOperator })}
        className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
      >
        {OPERATORS.map((operator) => (
          <option key={operator} value={operator}>
            {ASSERTION_OPERATOR_LABELS[operator]}
          </option>
        ))}
      </select>

      <Input
        value={assertion.expectedValue}
        onChange={(event) => onChange({ expectedValue: event.target.value })}
        placeholder={
          assertion.type === "RESPONSE_TIME"
            ? "Max ms (e.g. 200)"
            : assertion.operator === "EXISTS"
              ? "true or false"
              : "Expected value"
        }
        className="flex-1 font-mono"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        aria-label="Remove assertion"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}