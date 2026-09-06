import { NextResponse } from "next/server";
import { z } from "zod";
import dns from "node:dns/promises";
import net from "node:net";
import http from "node:http";
import https from "node:https";

export const dynamic = "force-dynamic";

const proxyRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.url({ message: "Enter a valid URL" }),
  headers: z.record(z.string(), z.string()).default({}),
  body: z.string().optional(),
  hardTimeoutMs: z.number().int().positive().max(60000).default(30000)
});

const MAX_PAYLOAD_BYTES = 10 * 1024 * 1024; // 10MB hard ceiling

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    const [b0 = 0, b1 = 0] = parts;

    // 0.0.0.0/8 (Current network)
    if (b0 === 0) return true;
    // 10.0.0.0/8 (RFC 1918)
    if (b0 === 10) return true;
    // 127.0.0.0/8 (Loopback)
    if (b0 === 127) return true;
    // 169.254.0.0/16 (Link-local / Cloud Metadata)
    if (b0 === 169 && b1 === 254) return true;
    // 172.16.0.0/12 (RFC 1918)
    if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;
    // 192.168.0.0/16 (RFC 1918)
    if (b0 === 192 && b1 === 168) return true;
    // 100.64.0.0/10 (Carrier NAT)
    if (b0 === 100 && b1 >= 64 && b1 <= 127) return true;
    // Broadcast & Multicast
    if (b0 >= 224) return true;

    return false;
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    // Loopback
    if (normalized === "::1" || normalized === "::") return true;
    // Unique Local Address (fc00::/7)
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    // Link Local (fe80::/10)
    if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || 
        normalized.startsWith("fea") || normalized.startsWith("feb")) return true;
    // IPv4 mapped IPv6 (::ffff:127.0.0.1)
    if (normalized.includes("::ffff:")) {
      const ipv4Part = normalized.split("::ffff:")[1];
      if (ipv4Part && net.isIPv4(ipv4Part)) {
        return isPrivateIp(ipv4Part);
      }
    }
    return false;
  }

  return true;
}

async function validateHostSecurity(hostname: string): Promise<string> {
  const directIp = net.isIP(hostname);
  if (directIp) {
    if (isPrivateIp(hostname)) {
      throw new Error(`Access to target IP address is restricted: ${hostname}`);
    }
    return hostname;
  }

  const records = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!records || records.length === 0) {
    throw new Error(`Could not resolve hostname: ${hostname}`);
  }

  for (const record of records) {
    if (isPrivateIp(record.address)) {
      throw new Error(`SSRF blocked: Domain resolves to protected address: ${record.address}`);
    }
  }

  return records[0]?.address ?? hostname;
}

interface SocketTimingMetrics {
  dnsLookupMs: number;
  tcpHandshakeMs: number;
  tlsHandshakeMs: number;
  firstByteMs: number;
  durationMs: number;
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = proxyRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request parameters" },
      { status: 400 }
    );
  }

  const { method, url: targetUrlString, headers, body, hardTimeoutMs } = parsed.data;

  let targetUrl: URL;
  try {
    targetUrl = new URL(targetUrlString);
  } catch {
    return NextResponse.json({ error: "Invalid URL string" }, { status: 400 });
  }

  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    return NextResponse.json(
      { error: "Protocol not supported. Only http: and https: are allowed." },
      { status: 400 }
    );
  }

  try {
    await validateHostSecurity(targetUrl.hostname);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "SSRF check failed" },
      { status: 403 }
    );
  }

  const timings: SocketTimingMetrics = {
    dnsLookupMs: 0,
    tcpHandshakeMs: 0,
    tlsHandshakeMs: 0,
    firstByteMs: 0,
    durationMs: 0
  };

  const startTime = performance.now();
  let dnsTime = 0;
  let connectTime = 0;
  let tlsTime = 0;

  return new Promise<NextResponse>((resolve) => {
    const isHttps = targetUrl.protocol === "https:";
    const transport = isHttps ? https : http;
    const port = targetUrl.port || (isHttps ? 443 : 80);

    const clientReq = transport.request(
      {
        protocol: targetUrl.protocol,
        hostname: targetUrl.hostname,
        port,
        path: `${targetUrl.pathname}${targetUrl.search}`,
        method,
        headers: {
          ...headers,
          host: targetUrl.host
        },
        timeout: hardTimeoutMs
      },
      (upstreamRes) => {
        const firstByteStamp = performance.now();
        timings.firstByteMs = Math.round(firstByteStamp - startTime);

        const chunks: Buffer[] = [];
        let totalSize = 0;

        upstreamRes.on("data", (chunk: Buffer) => {
          totalSize += chunk.length;
          if (totalSize > MAX_PAYLOAD_BYTES) {
            clientReq.destroy(new Error(`Payload exceeded limit of ${MAX_PAYLOAD_BYTES} bytes`));
            return;
          }
          chunks.push(chunk);
        });

        upstreamRes.on("end", () => {
          const endTime = performance.now();
          timings.durationMs = Math.round(endTime - startTime);

          const rawBuffer = Buffer.concat(chunks);
          const rawBody = rawBuffer.toString("utf-8");

          let parsedBody: unknown = rawBody;
          let isJson = false;
          try {
            if (rawBody.trim().length > 0) {
              parsedBody = JSON.parse(rawBody);
              isJson = typeof parsedBody === "object" && parsedBody !== null;
            } else {
              parsedBody = null;
            }
          } catch {
            // Raw text fallback
          }

          const responseHeaders: Record<string, string> = {};
          for (const [key, value] of Object.entries(upstreamRes.headers)) {
            if (value !== undefined) {
              responseHeaders[key] = Array.isArray(value) ? value.join(", ") : value;
            }
          }

          resolve(
            NextResponse.json({
              status: upstreamRes.statusCode ?? 0,
              statusText: upstreamRes.statusMessage ?? "",
              headers: responseHeaders,
              body: parsedBody,
              rawBody,
              isJson,
              sizeBytes: totalSize,
              ...timings
            })
          );
        });
      }
    );

    clientReq.on("socket", (socket) => {
      socket.on("lookup", () => {
        dnsTime = performance.now();
        timings.dnsLookupMs = Math.round(dnsTime - startTime);
      });

      socket.on("connect", () => {
        connectTime = performance.now();
        timings.tcpHandshakeMs = Math.round(connectTime - (dnsTime || startTime));
      });

      socket.on("secureConnect", () => {
        tlsTime = performance.now();
        timings.tlsHandshakeMs = Math.round(tlsTime - connectTime);
      });
    });

    clientReq.on("timeout", () => {
      clientReq.destroy(new Error(`Hard network timeout of ${hardTimeoutMs}ms exceeded`));
    });

    clientReq.on("error", (err: Error) => {
      const durationMs = Math.round(performance.now() - startTime);
      resolve(
        NextResponse.json(
          {
            error: err.message || "Upstream socket connection failed",
            durationMs
          },
          { status: 504 }
        )
      );
    });

    if (body && method !== "GET") {
      clientReq.write(body);
    }
    clientReq.end();
  });
}