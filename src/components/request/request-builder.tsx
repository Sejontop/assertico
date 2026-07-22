"use client";

import { useEffect, useMemo, useState } from "react";
import { UrlBar } from "@/components/request/url-bar";
import { KeyValueEditor } from "@/components/request/key-value-editor";
import { BodyEditor } from "@/components/request/body-editor";
import { SaveRequestBar } from "@/components/request/save-request-bar";
import { ResponseViewer } from "@/components/response/response-viewer";
import { AssertionEditor } from "@/components/assertion/assertion-editor";
import { AssertionSummary } from "@/components/assertion/assertion-summary";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useKeyValuePairs } from "@/hooks/use-key-value-pairs";
import { useRequestSender } from "@/hooks/use-request-sender";
import { useAssertions } from "@/hooks/use-assertions";
import { runAssertions } from "@/lib/assertion-engine";
import { buildUrlWithQueryParams } from "@/lib/request";
import { saveHistoryEntry } from "@/app/(dashboard)/history/actions";
import { createId } from "@/utils/id";
import type { AssertionResult, BodyType, HttpMethod, KeyValuePair } from "@/types";

type PanelTab = "headers" | "params" | "body" | "assertions";

interface CollectionOption {
  id: string;
  name: string;
}

interface RequestBuilderProps {
  initialMethod?: HttpMethod;
  initialUrl?: string;
  initialHeaders?: Record<string, string>;
  initialQueryParams?: Record<string, string>;
  initialBodyType?: BodyType;
  initialBodyText?: string;
  initialName?: string;
  initialSavedRequestId?: string;
  initialCollectionId?: string;
  collections?: CollectionOption[];
}

function recordToPairs(record: Record<string, string> | undefined): KeyValuePair[] | undefined {
  if (!record) {
    return undefined;
  }
  const entries = Object.entries(record);
  if (entries.length === 0) {
    return undefined;
  }
  return entries.map(([key, value]) => ({ id: createId(), key, value, enabled: true }));
}

export function RequestBuilder({
  initialMethod = "GET",
  initialUrl = "",
  initialHeaders,
  initialQueryParams,
  initialBodyType = "NONE",
  initialBodyText = "",
  initialName = "",
  initialSavedRequestId,
  initialCollectionId = "",
  collections = []
}: RequestBuilderProps) {
  const [method, setMethod] = useState<HttpMethod>(initialMethod);
  const [url, setUrl] = useState(initialUrl);
  const [bodyType, setBodyType] = useState<BodyType>(initialBodyType);
  const [bodyText, setBodyText] = useState(initialBodyText);
  const [activeTab, setActiveTab] = useState<PanelTab>("headers");

  const [requestName, setRequestName] = useState(initialName);
  const [savedRequestId, setSavedRequestId] = useState<string | null>(
    initialSavedRequestId ?? null
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState(initialCollectionId);

  const headers = useKeyValuePairs(recordToPairs(initialHeaders));
  const queryParams = useKeyValuePairs(recordToPairs(initialQueryParams));
  const formData = useKeyValuePairs();
  const assertions = useAssertions();

  const { response, error, isLoading, send, cancel } = useRequestSender();

  const assertionResults: AssertionResult[] = useMemo(() => {
    if (!response) {
      return [];
    }
    return runAssertions(assertions.assertions, {
      status: response.status,
      body: response.body,
      headers: response.headers
    });
  }, [response, assertions.assertions]);

  const assertionResultsById = useMemo(
    () => new Map(assertionResults.map((result) => [result.id, result])),
    [assertionResults]
  );

  useEffect(() => {
    if (!response) {
      return;
    }

    const finalUrl = buildUrlWithQueryParams(url, queryParams.pairs);
    const headerRecord = headers.pairs
      .filter((pair) => pair.enabled && pair.key.trim().length > 0)
      .reduce<Record<string, string>>((acc, pair) => {
        acc[pair.key] = pair.value;
        return acc;
      }, {});

    const passed = assertionResults.filter((result) => result.passed).length;
    const failed = assertionResults.length - passed;

    void saveHistoryEntry({
      method,
      url: finalUrl,
      headers: headerRecord,
      body: bodyType === "NONE" ? null : bodyText,
      status: response.status,
      durationMs: response.durationMs,
      assertionsPassed: passed,
      assertionsFailed: failed
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleSend = () => {
    void send({
      method,
      url,
      headers: headers.pairs,
      queryParams: queryParams.pairs,
      bodyType,
      bodyText,
      formData: formData.pairs
    });
  };

  return (
    <div className="space-y-4 p-6">
      <UrlBar
        method={method}
        onMethodChange={setMethod}
        url={url}
        onUrlChange={setUrl}
        onSend={handleSend}
        onCancel={cancel}
        isLoading={isLoading}
      />

      <SaveRequestBar
        collections={collections}
        savedRequestId={savedRequestId}
        onSaved={setSavedRequestId}
        name={requestName}
        onNameChange={setRequestName}
        collectionId={selectedCollectionId}
        onCollectionIdChange={setSelectedCollectionId}
        method={method}
        url={url}
        headers={headers.pairs}
        queryParams={queryParams.pairs}
        bodyType={bodyType}
        bodyText={bodyText}
      />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PanelTab)}>
        <TabsList>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="params">Query Params</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="assertions">
            Assertions {assertions.assertions.length > 0 ? `(${assertions.assertions.length})` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="headers" className="pt-3">
          <KeyValueEditor
            pairs={headers.pairs}
            onAdd={headers.addPair}
            onUpdate={headers.updatePair}
            onToggle={headers.togglePair}
            onRemove={headers.removePair}
            keyPlaceholder="Header"
            emptyLabel="No headers yet."
          />
        </TabsContent>

        <TabsContent value="params" className="pt-3">
          <KeyValueEditor
            pairs={queryParams.pairs}
            onAdd={queryParams.addPair}
            onUpdate={queryParams.updatePair}
            onToggle={queryParams.togglePair}
            onRemove={queryParams.removePair}
            keyPlaceholder="Param"
            emptyLabel="No query params yet."
          />
        </TabsContent>

        <TabsContent value="body" className="pt-3">
          <BodyEditor
            bodyType={bodyType}
            onBodyTypeChange={setBodyType}
            bodyText={bodyText}
            onBodyTextChange={setBodyText}
            formData={formData.pairs}
            onFormAdd={formData.addPair}
            onFormUpdate={formData.updatePair}
            onFormToggle={formData.togglePair}
            onFormRemove={formData.removePair}
          />
        </TabsContent>

        <TabsContent value="assertions" className="space-y-2 pt-3">
          <AssertionSummary results={assertionResults} />
          <AssertionEditor
            assertions={assertions.assertions}
            results={assertionResultsById}
            onAdd={assertions.addAssertion}
            onUpdate={assertions.updateAssertion}
            onRemove={assertions.removeAssertion}
          />
        </TabsContent>
      </Tabs>

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          Sending request...
        </div>
      ) : null}

      {response && !isLoading ? <ResponseViewer response={response} /> : null}

      {!response && !isLoading && !error ? (
        <div className="rounded-md border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
          Send a request to see the response here.
        </div>
      ) : null}
    </div>
  );
}
