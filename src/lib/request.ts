import type { BodyType, ExecutedResponse, HttpMethod, KeyValuePair } from "@/types";
import { urlSchema } from "@/lib/validators";

export class RequestExecutionError extends Error {}

function enabledPairs(pairs: KeyValuePair[]): KeyValuePair[] {
  return pairs.filter((pair) => pair.enabled && pair.key.trim().length > 0);
}

export function buildUrlWithQueryParams(
  rawUrl: string,
  queryParams: KeyValuePair[]
): string {
  const pairs = enabledPairs(queryParams);
  if (pairs.length === 0) {
    return rawUrl;
  }

  const url = new URL(rawUrl);
  pairs.forEach((pair) => {
    url.searchParams.set(pair.key, pair.value);
  });

  return url.toString();
}

function pairsToHeaderRecord(pairs: KeyValuePair[]): Record<string, string> {
  return enabledPairs(pairs).reduce<Record<string, string>>((acc, pair) => {
    acc[pair.key] = pair.value;
    return acc;
  }, {});
}

interface BuiltBody {
  body: string | undefined;
  contentType: string | undefined;
}

export function buildRequestBody(
  bodyType: BodyType,
  bodyText: string,
  formPairs: KeyValuePair[]
): BuiltBody {
  switch (bodyType) {
    case "NONE":
      return { body: undefined, contentType: undefined };

    case "JSON": {
      if (bodyText.trim().length > 0) {
        try {
          JSON.parse(bodyText);
        } catch {
          throw new RequestExecutionError("Body is not valid JSON");
        }
      }
      return { body: bodyText, contentType: "application/json" };
    }

    case "RAW":
      return { body: bodyText, contentType: "text/plain" };

    case "FORM_DATA": {
      const params = new URLSearchParams();
      enabledPairs(formPairs).forEach((pair) => {
        params.append(pair.key, pair.value);
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
  signal: AbortSignal;
}

export async function executeRequest(
  input: ExecuteRequestInput
): Promise<ExecutedResponse> {
  const finalUrl = buildUrlWithQueryParams(input.url, input.queryParams);

  const urlCheck = urlSchema.safeParse(finalUrl);
  if (!urlCheck.success) {
    throw new RequestExecutionError(
      urlCheck.error.issues[0]?.message ?? "Enter a valid URL"
    );
  }

  const headers = pairsToHeaderRecord(input.headers);
  const { body, contentType } = buildRequestBody(
    input.bodyType,
    input.bodyText,
    input.formData
  );

  const hasContentTypeHeader = Object.keys(headers).some(
    (key) => key.toLowerCase() === "content-type"
  );
  if (contentType && !hasContentTypeHeader) {
    headers["Content-Type"] = contentType;
  }

  const response = await fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: input.method,
      url: finalUrl,
      headers,
      body
    }),
    signal: input.signal
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new RequestExecutionError(payload.error ?? "Request failed");
  }

  return payload as ExecutedResponse;
}
