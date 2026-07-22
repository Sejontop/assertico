import { redirect } from "next/navigation";
import { RequestBuilder } from "@/components/request/request-builder";
import { getCurrentUser } from "@/lib/auth";
import { getHistoryEntry } from "@/lib/history";
import { getSavedRequest, listCollectionsWithCounts } from "@/lib/collections";
import type { BodyType, HttpMethod } from "@/types";

interface RequestsPageProps {
  searchParams: Promise<{
    historyId?: string;
    requestId?: string;
    collectionId?: string;
  }>;
}

function toRecord(value: unknown): Record<string, string> | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, string>;
  }
  return undefined;
}

function toBodyText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { historyId, requestId, collectionId } = await searchParams;

  const [historyEntry, savedRequest, collections] = await Promise.all([
    historyId ? getHistoryEntry(historyId, user.id) : Promise.resolve(null),
    requestId ? getSavedRequest(requestId, user.id) : Promise.resolve(null),
    listCollectionsWithCounts(user.id)
  ]);

  let initialMethod: HttpMethod | undefined;
  let initialUrl: string | undefined;
  let initialHeaders: Record<string, string> | undefined;
  let initialQueryParams: Record<string, string> | undefined;
  let initialBodyType: BodyType | undefined;
  let initialBodyText = "";
  let initialName: string | undefined;

  if (savedRequest) {
    initialMethod = savedRequest.method;
    initialUrl = savedRequest.url;
    initialHeaders = toRecord(savedRequest.headers);
    initialQueryParams = toRecord(savedRequest.queryParams);
    initialBodyType = savedRequest.bodyType;
    initialBodyText = toBodyText(savedRequest.body);
    initialName = savedRequest.name;
  } else if (historyEntry) {
    initialMethod = historyEntry.method;
    initialUrl = historyEntry.url;
    initialHeaders = toRecord(historyEntry.headers);
    initialBodyText = toBodyText(historyEntry.body);
    initialBodyType = initialBodyText ? "JSON" : "NONE";
  }

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Requests</h1>
        <p className="text-sm text-muted-foreground">
          Build, send, and inspect API requests.
        </p>
      </div>
      <RequestBuilder
        key={savedRequest?.id ?? historyEntry?.id ?? "new"}
        initialMethod={initialMethod}
        initialUrl={initialUrl}
        initialHeaders={initialHeaders}
        initialQueryParams={initialQueryParams}
        initialBodyType={initialBodyType}
        initialBodyText={initialBodyText}
        initialName={initialName}
        initialSavedRequestId={savedRequest?.id}
        initialCollectionId={savedRequest?.collectionId ?? collectionId ?? ""}
        collections={collections.map((collection) => ({
          id: collection.id,
          name: collection.name
        }))}
      />
    </div>
  );
}
