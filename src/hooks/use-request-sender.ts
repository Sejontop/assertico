"use client";

import { useCallback, useRef, useState } from "react";
import type { BodyType, ExecutedResponse, HttpMethod, KeyValuePair } from "@/types";
import { executeRequest, RequestExecutionError } from "@/lib/request";
import { urlSchema } from "@/lib/validators";

export interface SendRequestArgs {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  bodyType: BodyType;
  bodyText: string;
  formData: KeyValuePair[];
}

export function useRequestSender() {
  const [response, setResponse] = useState<ExecutedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const send = useCallback(async (args: SendRequestArgs) => {
    const urlCheck = urlSchema.safeParse(args.url);
    if (!urlCheck.success) {
      setError(urlCheck.error.issues[0]?.message ?? "Enter a valid URL");
      setResponse(null);
      return;
    }

    // Cancel whatever request is currently in flight before starting a new
    // one, so a slow first request can never overwrite a faster second one.
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const result = await executeRequest({
        method: args.method,
        url: args.url,
        headers: args.headers,
        queryParams: args.queryParams,
        bodyType: args.bodyType,
        bodyText: args.bodyText,
        formData: args.formData,
        signal: controller.signal
      });
      setResponse(result);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      const message =
        err instanceof RequestExecutionError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong sending the request";

      setError(message);
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { response, error, isLoading, send, cancel };
}
