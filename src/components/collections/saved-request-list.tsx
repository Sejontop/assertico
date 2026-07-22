"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { MethodBadge } from "@/components/history/method-badge";
import { deleteSavedRequestAction } from "@/app/(dashboard)/collections/actions";
import type { HttpMethod } from "@/types";

interface SavedRequestListItem {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
}

interface SavedRequestListProps {
  collectionId: string;
  requests: SavedRequestListItem[];
}

export function SavedRequestList({ collectionId, requests }: SavedRequestListProps) {
  const [isPending, startTransition] = useTransition();

  if (requests.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border px-3 py-12 text-center text-sm text-muted-foreground">
        No saved requests yet. Build one and save it here from the request
        builder.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-md border border-border">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <MethodBadge method={request.method} />
            <div>
              <p className="text-sm font-medium">{request.name}</p>
              <p className="max-w-md truncate font-mono text-xs text-muted-foreground">
                {request.url}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/requests?requestId=${request.id}`}>
              <Button type="button" variant="outline" size="sm">
                Open
              </Button>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => {
                if (!window.confirm(`Delete "${request.name}"?`)) {
                  return;
                }
                startTransition(() => {
                  void deleteSavedRequestAction(request.id, collectionId);
                });
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
