import { NextResponse } from "next/server";
import { z } from "zod";

const proxyRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().url("Enter a valid URL, including http:// or https://"),
  headers: z.record(z.string()).default({}),
  body: z.string().optional()
});

const REQUEST_TIMEOUT_MS = 30_000;

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = proxyRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { method, url, headers, body } = parsed.data;

  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    return NextResponse.json(
      { error: "Only http and https URLs are supported" },
      { status: 400 }
    );
  }

  const startedAt = performance.now();

  try {
    const upstreamResponse = await fetch(targetUrl.toString(), {
      method,
      headers,
      body: method === "GET" ? undefined : body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });

    const rawBody = await upstreamResponse.text();
    const durationMs = Math.round(performance.now() - startedAt);
    const sizeBytes = new TextEncoder().encode(rawBody).length;

    let parsedBody: unknown = rawBody;
    let isJson = false;
    try {
      if (rawBody.length > 0) {
        parsedBody = JSON.parse(rawBody);
        isJson = typeof parsedBody === "object" && parsedBody !== null;
      } else {
        parsedBody = null;
      }
    } catch {
      // Not JSON — keep the raw text as the body, isJson stays false.
    }

    const responseHeaders: Record<string, string> = {};
    upstreamResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
      body: parsedBody,
      rawBody,
      isJson,
      durationMs,
      sizeBytes
    });
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);
    const isTimeout = error instanceof Error && error.name === "TimeoutError";
    const message = isTimeout
      ? `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
      : error instanceof Error
        ? error.message
        : "Network error";

    return NextResponse.json({ error: message, durationMs }, { status: 502 });
  }
}
