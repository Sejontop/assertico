"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteCollectionAction } from "@/app/(dashboard)/collections/actions";

interface DeleteCollectionButtonProps {
  collectionId: string;
}

export function DeleteCollectionButton({ collectionId }: DeleteCollectionButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("Delete this collection and all its saved requests?")) {
      return;
    }
    startTransition(() => {
      void deleteCollectionAction(collectionId);
    });
  };

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete collection"}
    </Button>
  );
}
