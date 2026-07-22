import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MethodBadge } from "@/components/history/method-badge";
import { StatusPill } from "@/components/history/status-pill";
import type { HttpMethod } from "@/types";

export interface HistoryRow {
  id: string;
  method: HttpMethod;
  url: string;
  status: number;
  durationMs: number;
  assertionsPassed: number;
  assertionsFailed: number;
  createdAt: Date;
}

interface HistoryTableProps {
  entries: HistoryRow[];
}

export function HistoryTable({ entries }: HistoryTableProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border px-3 py-12 text-center text-sm text-muted-foreground">
        No requests match these filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Method</th>
            <th className="px-3 py-2 font-medium">URL</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Duration</th>
            <th className="px-3 py-2 font-medium">Assertions</th>
            <th className="px-3 py-2 font-medium">When</th>
            <th className="px-3 py-2 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-3 py-2">
                <MethodBadge method={entry.method} />
              </td>
              <td
                className="max-w-xs truncate px-3 py-2 font-mono text-xs"
                title={entry.url}
              >
                {entry.url}
              </td>
              <td className="px-3 py-2">
                <StatusPill status={entry.status} />
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {entry.durationMs} ms
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {entry.assertionsPassed + entry.assertionsFailed > 0
                  ? `${entry.assertionsPassed}/${entry.assertionsPassed + entry.assertionsFailed}`
                  : "—"}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {entry.createdAt.toLocaleString()}
              </td>
              <td className="px-3 py-2 text-right">
                <Link href={`/requests?historyId=${entry.id}`}>
                  <Button type="button" variant="outline" size="sm">
                    Duplicate
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
