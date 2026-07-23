"use client";

import { useActionState } from "react";
import { createCollectionAction } from "@/app/(dashboard)/collections/actions";
import { initialCollectionState } from "@/lib/collection-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/auth/form-message";

export function CreateCollectionForm() {
  const [state, formAction, isPending] = useActionState(
    createCollectionAction,
    initialCollectionState
  );

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-md border border-border bg-card p-4"
    >
      <h2 className="text-sm font-semibold">New collection</h2>

      {state.error ? <FormMessage variant="error">{state.error}</FormMessage> : null}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Public API" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          name="description"
          placeholder="Endpoints for the public API"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create collection"}
      </Button>
    </form>
  );
}
