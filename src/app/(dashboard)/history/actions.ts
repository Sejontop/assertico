"use server";

import { getCurrentUser } from "@/lib/auth";
import { saveHistory } from "@/lib/history";
import type { HttpMethod } from "@/types";

export interface SaveHistoryEntryArgs {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body: unknown;
  status: number;
  durationMs: number;
  assertionsPassed: number;
  assertionsFailed: number;
}

export async function saveHistoryEntry(args: SaveHistoryEntryArgs): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  await saveHistory({ userId: user.id, ...args });
}
