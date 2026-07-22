import { MethodBadge } from "@/components/history/method-badge";
import { EmptyState } from "@/components/admin/empty-state";
import type { HttpMethod } from "@/types";

interface RequestRow {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  updatedAt: Date;
  collection: {
    name: string;
    user: { email: string };
  };
}

interface RequestsTableProps {
  requests: RequestRow[];
}

export function RequestsTable({ requests }: RequestsTableProps) {
  if (requests.length === 0) {
    return <EmptyState title="No saved requests found" description="Try a different filter." />;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Method</th>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">URL</th>
            <th className="px-3 py-2 font-medium">Collection</th>
            <th className="px-3 py-2 font-medium">Owner</th>
            <th className="px-3 py-2 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-3 py-2">
                <MethodBadge method={request.method} />
              </td>
              <td className="px-3 py-2">{request.name}</td>
              <td
                className="max-w-xs truncate px-3 py-2 font-mono text-xs text-muted-foreground"
                title={request.url}
              >
                {request.url}
              </td>
              <td className="px-3 py-2 text-muted-foreground">{request.collection.name}</td>
              <td className="px-3 py-2 text-muted-foreground">
                {request.collection.user.email}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {request.updatedAt.toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
