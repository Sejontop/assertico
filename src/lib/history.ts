import { prisma } from "@/lib/prisma";
import type { HttpMethod } from "@/types";
import type { Prisma } from "@prisma/client";

const MAX_STORED_JSON_CHARS = 20_000;

function truncateForStorage(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const serialized = JSON.stringify(value);
  if (serialized.length <= MAX_STORED_JSON_CHARS) {
    return value as Prisma.InputJsonValue;
  }

  return {
    truncated: true,
    preview: serialized.slice(0, MAX_STORED_JSON_CHARS)
  } as Prisma.InputJsonValue;
}

export interface SaveHistoryInput {
  userId: string;
  requestId?: string | null;
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  status: number;
  durationMs: number;
  assertionsPassed?: number;
  assertionsFailed?: number;
}

export async function saveHistory(input: SaveHistoryInput) {
  return prisma.requestHistory.create({
    data: {
      userId: input.userId,
      requestId: input.requestId ?? null,
      method: input.method,
      url: input.url,
      headers: truncateForStorage(input.headers),
      body: truncateForStorage(input.body),
      status: input.status,
      durationMs: input.durationMs,
      assertionsPassed: input.assertionsPassed ?? 0,
      assertionsFailed: input.assertionsFailed ?? 0
    }
  });
}

export type HistoryStatusFilter = "ALL" | "SUCCESS" | "CLIENT_ERROR" | "SERVER_ERROR";

export interface ListHistoryParams {
  userId: string;
  page: number;
  pageSize: number;
  search?: string;
  method?: HttpMethod;
  statusFilter?: HistoryStatusFilter;
}

export async function listHistory(params: ListHistoryParams) {
  const { userId, page, pageSize, search, method, statusFilter } = params;

  const statusRange: Prisma.RequestHistoryWhereInput =
    statusFilter === "SUCCESS"
      ? { status: { gte: 200, lt: 300 } }
      : statusFilter === "CLIENT_ERROR"
        ? { status: { gte: 400, lt: 500 } }
        : statusFilter === "SERVER_ERROR"
          ? { status: { gte: 500, lt: 600 } }
          : {};

  const where: Prisma.RequestHistoryWhereInput = {
    userId,
    ...(method ? { method } : {}),
    ...(search ? { url: { contains: search, mode: "insensitive" } } : {}),
    ...statusRange
  };

  const [entries, total] = await Promise.all([
    prisma.requestHistory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.requestHistory.count({ where })
  ]);

  return {
    entries,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
}

export async function getHistoryEntry(id: string, userId: string) {
  return prisma.requestHistory.findFirst({ where: { id, userId } });
}
