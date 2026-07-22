import { listAllCollections } from "@/lib/admin";
import { CollectionsTable } from "@/components/admin/collections-table";
import { Pagination } from "@/components/history/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

interface AdminCollectionsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function AdminCollectionsPage({ searchParams }: AdminCollectionsPageProps) {
  const params = await searchParams;
  const search = params.q?.trim() || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const result = await listAllCollections({ search, page, pageSize: PAGE_SIZE });

  const buildHref = (targetPage: number) => {
    const query = new URLSearchParams();
    query.set("page", String(targetPage));
    if (search) query.set("q", search);
    return `/admin/collections?${query.toString()}`;
  };

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Collections</h1>
        <p className="text-sm text-muted-foreground">{result.total} total collections.</p>
      </div>
      <div className="space-y-4 p-6">
        <form action="/admin/collections" method="GET" className="flex items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="q" className="text-xs text-muted-foreground">
              Search name
            </label>
            <Input id="q" name="q" defaultValue={search} placeholder="Public API" className="w-64" />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        <CollectionsTable collections={result.collections} />

        <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
      </div>
    </div>
  );
}
