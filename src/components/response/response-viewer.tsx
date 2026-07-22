"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/response/status-badge";
import { JsonViewer } from "@/components/response/json-viewer";
import { HeadersTable } from "@/components/response/headers-table";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { formatBytes } from "@/utils/format-bytes";
import type { ExecutedResponse } from "@/types";

interface ResponseViewerProps {
  response: ExecutedResponse;
}

type ResponseTab = "body" | "headers";

export function ResponseViewer({ response }: ResponseViewerProps) {
  const [tab, setTab] = useState<ResponseTab>("body");
  const { copied, copy } = useCopyToClipboard();

  const headerCount = Object.keys(response.headers).length;

  return (
    <div className="space-y-3 rounded-md border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={response.status} statusText={response.statusText} />
        <span className="text-sm text-muted-foreground">
          {response.durationMs} ms
        </span>
        <span className="text-sm text-muted-foreground">
          {formatBytes(response.sizeBytes)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => copy(response.rawBody)}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy response"}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as ResponseTab)}>
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers ({headerCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="pt-3">
          {response.isJson ? (
            <JsonViewer value={response.body} />
          ) : (
            <pre className="overflow-auto rounded-md border border-border bg-background p-3 font-mono text-xs leading-relaxed text-foreground">
              {response.rawBody.length > 0
                ? response.rawBody
                : "(empty response body)"}
            </pre>
          )}
        </TabsContent>

        <TabsContent value="headers" className="pt-3">
          <HeadersTable headers={response.headers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
