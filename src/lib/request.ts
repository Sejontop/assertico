import type { BodyType, ExecutedResponse, HttpMethod, KeyValuePair } from "@/types";
import { urlSchema } from "@/lib/validators";
import {
  interpolateHeaders,
  interpolateString,
  type InterpolationContext
} from "@/lib/variable-parser";

export class RequestExecutionError extends Error {}

function enabledPairs(pairs: KeyValuePair[]): KeyValuePair[] {
  return pairs.filter((pair) => pair.enabled && pair.key.trim().length > 0);
}

export function buildUrlWithQueryParams(
  rawUrl: string,
  queryParams: KeyValuePair[],
  context?: InterpolationContext
): string {
  const urlWithVars = context ? interpolateString(rawUrl, context) : rawUrl;
  const pairs = enabledPairs(queryParams);

  if (pairs.length === 0) {
    return urlWithVars;
  }

  try {
    const parsedUrl = new URL(urlWithVars);
    pairs.forEach((pair) => {
      const key = context ? interpolateString(pair.key, context) : pair.key;
      const value = context ? interpolateString(pair.value, context) : pair.value;
      parsedUrl.searchParams.set(key, value);
    });
    return parsedUrl.toString();
  } catch {
    // If the URL is still parameterized or relative before full execution, append params manually
    const separator = urlWithVars.includes("?") ? "&" : "?";
    const queryString = pairs
      .map((pair) => {
        const k = encodeURIComponent(context ? interpolateString(pair.key, context) : pair.key);
        const v = encodeURIComponent(context ? interpolateString(pair.value, context) : pair.value);
        return `${k}=${v}`;
      })
      .join("&");

    return `${urlWithVars}${separator}${queryString}`;
  }
}

function pairsToHeaderRecord(
  pairs: KeyValuePair[],
  context?: InterpolationContext
): Record<string, string> {
  const rawHeaders = enabledPairs(pairs).reduce<Record<string, string>>((acc, pair) => {
    acc[pair.key] = pair.value;
    return acc;
  }, {});

  return context ? interpolateHeaders(rawHeaders, context) : rawHeaders;
}

interface BuiltBody {
  body: string | undefined;
  contentType: string | undefined;
}

export function buildRequestBody(
  bodyType: BodyType,
  bodyText: string,
  formPairs: KeyValuePair[],
  context?: InterpolationContext
): BuiltBody {
  const evaluatedText = context ? interpolateString(bodyText, context) : bodyText;

  switch (bodyType) {
    case "NONE":
      return { body: undefined, contentType: undefined };

    case "JSON": {
      if (evaluatedText.trim().length > 0) {
        try {
          JSON.parse(evaluatedText);
        } catch {
          throw new RequestExecutionError("Interpolated body is not valid JSON");
        }
      }
      return { body: evaluatedText, contentType: "application/json" };
    }

    case "RAW":
      return { body: evaluatedText, contentType: "text/plain" };

    case "FORM_DATA": {
      const params = new URLSearchParams();
      enabledPairs(formPairs).forEach((pair) => {
        const k = context ? interpolateString(pair.key, context) : pair.key;
        const v = context ? interpolateString(pair.value, context) : pair.value;
        params.append(k, v);
      });
      return {
        body: params.toString(),
        contentType: "application/x-www-form-urlencoded"
      };
    }

    default:
      return { body: undefined, contentType: undefined };
  }
}

export interface ExecuteRequestInput {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  bodyType: BodyType;
  bodyText: string;
  formData: KeyValuePair[];
  variables?: Record<string, string | number | boolean>;
  hardTimeoutMs?: number;
  signal: AbortSignal;
}

export async function executeRequest(
  input: ExecuteRequestInput
): Promise<ExecutedResponse> {
  const context: InterpolationContext = {
    variables: input.variables ?? {}
  };

  const finalUrl = buildUrlWithQueryParams(input.url, input.queryParams, context);

  const urlCheck = urlSchema.safeParse(finalUrl);
  if (!urlCheck.success) {
    throw new RequestExecutionError(
      urlCheck.error.issues[0]?.message ?? "Enter a valid URL"
    );
  }

  const headers = pairsToHeaderRecord(input.headers, context);
  const { body, contentType } = buildRequestBody(
    input.bodyType,
    input.bodyText,
    input.formData,
    context
  );

  const hasContentTypeHeader = Object.keys(headers).some(
    (key) => key.toLowerCase() === "content-type"
  );
  if (contentType && !hasContentTypeHeader) {
    headers["Content-Type"] = contentType;
  }

  let response: Response;
  try {
    response = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: input.method,
        url: finalUrl,
        headers,
        body,
        hardTimeoutMs: input.hardTimeoutMs ?? 30000
      }),
      signal: input.signal
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    throw new RequestExecutionError(
      err instanceof Error ? err.message : "Failed to connect to proxy endpoint"
    );
  }

  // Safe deserialization to handle edge-case raw 502/504 gateway drops
  const rawText = await response.text();
  let payload: Record<string, any> = {};

  try {
    payload = rawText ? JSON.parse(rawText) : {};
  } catch {
    payload = { error: rawText || `Network error with status code ${response.status}` };
  }

  if (!response.ok) {
    throw new RequestExecutionError(payload.error ?? `Proxy Request Failed (${response.status})`);
  }

  return payload as ExecutedResponse;
}