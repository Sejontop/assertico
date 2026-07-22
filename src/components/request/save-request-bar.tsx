"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveRequestAction } from "@/app/(dashboard)/collections/actions";
import type { BodyType, HttpMethod, KeyValuePair } from "@/types";

interface CollectionOption {
  id: string;
  name: string;
}

interface SaveRequestBarProps {
  collections: CollectionOption[];
  savedRequestId: string | null;
  onSaved: (id: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  collectionId: string;
  onCollectionIdChange: (value: string) => void;
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  bodyType: BodyType;
  bodyText: string;
}

function pairsToRecord(pairs: KeyValuePair[]): Record<string, string> {
  return pairs
    .filter((pair) => pair.enabled && pair.key.trim().length > 0)
    .reduce<Record<string, string>>((acc, pair) => {
      acc[pair.key] = pair.value;
      return acc;
    }, {});
}

export function SaveRequestBar(props: SaveRequestBarProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  if (props.collections.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Create a collection to save this request for later.
      </p>
    );
  }

  const handleSave = () => {
    if (!props.name.trim()) {
      setError("Give this request a name first");
      return;
    }
    if (!props.collectionId) {
      setError("Choose a collection first");
      return;
    }

    setError(null);
    setSavedMessage(null);

    startTransition(async () => {
      const result = await saveRequestAction({
        id: props.savedRequestId ?? undefined,
        collectionId: props.collectionId,
        name: props.name,
        method: props.method,
        url: props.url,
        headers: pairsToRecord(props.headers),
        queryParams: pairsToRecord(props.queryParams),
        body: props.bodyType === "NONE" ? null : props.bodyText,
        bodyType: props.bodyType
      });

      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.savedRequestId) {
        props.onSaved(result.savedRequestId);
        setSavedMessage("Saved");
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-3">
      <Input
        value={props.name}
        onChange={(event) => props.onNameChange(event.target.value)}
        placeholder="Request name"
        className="w-48"
      />
      <select
        value={props.collectionId}
        onChange={(event) => props.onCollectionIdChange(event.target.value)}
        className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
      >
        <option value="">Choose a collection</option>
        {props.collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.name}
          </option>
        ))}
      </select>
      <Button type="button" variant="outline" size="sm" onClick={handleSave} disabled={isPending}>
        {isPending ? "Saving..." : props.savedRequestId ? "Update" : "Save"}
      </Button>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
      {savedMessage && !error ? (
        <span className="text-xs text-success">{savedMessage}</span>
      ) : null}
    </div>
  );
}
