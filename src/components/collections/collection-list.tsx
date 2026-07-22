import Link from "next/link";

interface CollectionListItem {
  id: string;
  name: string;
  description: string | null;
  _count: { requests: number };
}

interface CollectionListProps {
  collections: CollectionListItem[];
}

export function CollectionList({ collections }: CollectionListProps) {
  if (collections.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border px-3 py-12 text-center text-sm text-muted-foreground">
        No collections yet. Create one to start grouping requests.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <Link
          key={collection.id}
          href={`/collections/${collection.id}`}
          className="rounded-md border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
        >
          <h3 className="font-semibold">{collection.name}</h3>
          {collection.description ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {collection.description}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            {collection._count.requests}{" "}
            {collection._count.requests === 1 ? "request" : "requests"}
          </p>
        </Link>
      ))}
    </div>
  );
}
