import { MethodBadge } from "@/components/history/method-badge";
import { StatusPill } from "@/components/history/status-pill";
import { EmptyState } from "@/components/admin/empty-state";
import type { HttpMethod } from "@/types";

interface AdminHistoryRow {
  id: string;
  method: HttpMethod;
  url: string;
  status: number;
  durationMs: number;
  createdAt: Date;
  user: { email: string };
}

interface AdminHistoryTableProps {
  entries: AdminHistoryRow[];
}

export function AdminHistoryTable({ entries }: AdminHistoryTableProps) {
  if (entries.length === 0) {
    return (
      <EmptyState title="No execution history found" description="Try a different filter." />
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
            <th className="px-3 py-2 font-medium">User</th>
            <th className="px-3 py-2 font-medium">When</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-3 py-2">
                <MethodBadge method={entry.method} />
              </td>
              <td
                className="max-w-xs truncate px-3 py-2 font-mono text-xs text-muted-foreground"
                title={entry.url}
              >
                {entry.url}
              </td>
              <td className="px-3 py-2">
                <StatusPill status={entry.status} />
              </td>
              <td className="px-3 py-2 text-muted-foreground">{entry.durationMs} ms</td>
              <td className="px-3 py-2 text-muted-foreground">{entry.user.email}</td>
              <td className="px-3 py-2 text-muted-foreground">
                {entry.createdAt.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
