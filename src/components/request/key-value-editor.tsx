"use client";

import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { KeyValuePair } from "@/types";

interface KeyValueEditorProps {
  pairs: KeyValuePair[];
  onAdd: () => void;
  onUpdate: (id: string, field: "key" | "value", value: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  emptyLabel?: string;
}

export function KeyValueEditor({
  pairs,
  onAdd,
  onUpdate,
  onToggle,
  onRemove,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  emptyLabel = "No entries yet."
}: KeyValueEditorProps) {
  return (
    <div className="space-y-2">
      {pairs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : null}

      {pairs.map((pair) => (
        <div key={pair.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={pair.enabled}
            onChange={() => onToggle(pair.id)}
            aria-label="Row enabled"
            className="h-4 w-4 rounded border-input"
          />
          <Input
            value={pair.key}
            onChange={(event) => onUpdate(pair.id, "key", event.target.value)}
            placeholder={keyPlaceholder}
            className="flex-1 font-mono"
          />
          <Input
            value={pair.value}
            onChange={(event) => onUpdate(pair.id, "value", event.target.value)}
            placeholder={valuePlaceholder}
            className="flex-1 font-mono"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(pair.id)}
            aria-label="Remove row"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Add row
      </Button>
    </div>
  );
}
