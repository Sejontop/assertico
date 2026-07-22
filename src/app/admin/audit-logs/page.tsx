import { listAuditLogs } from "@/lib/audit";
import { EmptyState } from "@/components/admin/empty-state";
import { Pagination } from "@/components/history/pagination";

const PAGE_SIZE = 20;

interface AdminAuditLogsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminAuditLogsPage({ searchParams }: AdminAuditLogsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const result = await listAuditLogs({ page, pageSize: PAGE_SIZE });

  const buildHref = (targetPage: number) => `/admin/audit-logs?page=${targetPage}`;

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          {result.total} recorded admin actions.
        </p>
      </div>
      <div className="space-y-4 p-6">
        {result.logs.length === 0 ? (
          <EmptyState
            title="No admin actions yet"
            description="Promote/demote actions will show up here."
          />
        ) : (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Admin</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                  <th className="px-3 py-2 font-medium">Target</th>
                  <th className="px-3 py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-3 py-2 text-muted-foreground">{log.admin.email}</td>
                    <td className="px-3 py-2 font-mono text-xs">{log.action}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {log.targetType} · {log.targetId}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {log.createdAt.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}
