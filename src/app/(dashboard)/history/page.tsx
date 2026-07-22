import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listHistory } from "@/lib/history";
import { HistoryFilters } from "@/components/history/history-filters";
import { HistoryTable } from "@/components/history/history-table";
import { Pagination } from "@/components/history/pagination";
import type { HistoryStatusFilter } from "@/lib/history";
import type { HttpMethod } from "@/types";

const PAGE_SIZE = 20;

interface HistoryPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    method?: string;
    status?: string;
  }>;
}

function isHttpMethod(value: string): value is HttpMethod {
  return ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(value);
}

function isStatusFilter(value: string): value is HistoryStatusFilter {
  return ["ALL", "SUCCESS", "CLIENT_ERROR", "SERVER_ERROR"].includes(value);
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.q?.trim() || undefined;
  const method = params.method && isHttpMethod(params.method) ? params.method : undefined;
  const statusFilter: HistoryStatusFilter =
    params.status && isStatusFilter(params.status) ? params.status : "ALL";

  const result = await listHistory({
    userId: user.id,
    page,
    pageSize: PAGE_SIZE,
    search,
    method,
    statusFilter
  });

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    query.set("page", String(targetPage));
    if (search) query.set("q", search);
    if (method) query.set("method", method);
    if (statusFilter !== "ALL") query.set("status", statusFilter);
    return `/history?${query.toString()}`;
  };

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">History</h1>
        <p className="text-sm text-muted-foreground">
          Every request you&apos;ve sent, with search, filtering, and pagination.
        </p>
      </div>
      <div className="space-y-4 p-6">
        <HistoryFilters search={search} method={method} status={statusFilter} />
        <HistoryTable entries={result.entries} />
        <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}
