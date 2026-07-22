import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUserDetail, listUsers } from "@/lib/admin";
import { UsersTable } from "@/components/admin/users-table";
import { EmptyState } from "@/components/admin/empty-state";
import { Pagination } from "@/components/history/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

interface AdminUsersPageProps {
  searchParams: Promise<{ q?: string; page?: string; userId?: string }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const admin = await getCurrentUser();
  const params = await searchParams;

  if (params.userId) {
    const detail = await getUserDetail(params.userId);

    return (
      <div>
        <div className="border-b border-border px-6 py-4">
          <Link href="/admin/users" className="text-xs text-muted-foreground hover:underline">
            ← All users
          </Link>
          <h1 className="text-lg font-semibold">User detail</h1>
        </div>
        <div className="space-y-4 p-6">
          {detail ? (
            <>
              <div className="rounded-md border border-border bg-card p-4">
                <h2 className="text-sm font-semibold">{detail.email}</h2>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <dt className="text-xs text-muted-foreground">Role</dt>
                    <dd>{detail.role}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Joined</dt>
                    <dd>{detail.createdAt.toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Collections</dt>
                    <dd>{detail._count.collections}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Requests Sent</dt>
                    <dd>{detail._count.history}</dd>
                  </div>
                </dl>
              </div>
              <UsersTable users={[detail]} currentAdminId={admin?.id ?? ""} />
            </>
          ) : (
            <EmptyState title="User not found" description="It may have been removed." />
          )}
        </div>
      </div>
    );
  }

  const search = params.q?.trim() || undefined;
  const page = Math.max(1, Number(params.page) || 1);
  const result = await listUsers({ search, page, pageSize: PAGE_SIZE });

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    query.set("page", String(targetPage));
    if (search) query.set("q", search);
    return `/admin/users?${query.toString()}`;
  };

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">{result.total} total users.</p>
      </div>
      <div className="space-y-4 p-6">
        <form action="/admin/users" method="GET" className="flex items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="q" className="text-xs text-muted-foreground">
              Search email
            </label>
            <Input id="q" name="q" defaultValue={search} placeholder="user@example.com" className="w-64" />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        <UsersTable users={result.users} currentAdminId={admin?.id ?? ""} />

        <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}
