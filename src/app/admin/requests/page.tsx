import { listAllRequests, listUsersForFilter } from "@/lib/admin";
import { RequestsTable } from "@/components/admin/requests-table";
import { Pagination } from "@/components/history/pagination";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

interface AdminRequestsPageProps {
  searchParams: Promise<{ userId?: string; page?: string }>;
}

export default async function AdminRequestsPage({ searchParams }: AdminRequestsPageProps) {
  const params = await searchParams;
  const userId = params.userId || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const [result, users] = await Promise.all([
    listAllRequests({ userId, page, pageSize: PAGE_SIZE }),
    listUsersForFilter()
  ]);

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    query.set("page", String(targetPage));
    if (userId) query.set("userId", userId);
    return `/admin/requests?${query.toString()}`;
  };

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Requests</h1>
        <p className="text-sm text-muted-foreground">{result.total} saved requests.</p>
      </div>
      <div className="space-y-4 p-6">
        <form action="/admin/requests" method="GET" className="flex items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="userId" className="text-xs text-muted-foreground">
              Filter by user
            </label>
            <select
              id="userId"
              name="userId"
              defaultValue={userId ?? ""}
              className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
            >
              <option value="">All users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </form>

        <RequestsTable requests={result.requests} />

        <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}
