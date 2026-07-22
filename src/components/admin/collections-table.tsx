import { EmptyState } from "@/components/admin/empty-state";

interface CollectionRow {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  user: { email: string };
  _count: { requests: number };
}

interface CollectionsTableProps {
  collections: CollectionRow[];
}

export function CollectionsTable({ collections }: CollectionsTableProps) {
  if (collections.length === 0) {
    return (
      <EmptyState title="No collections found" description="Try a different search term." />
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Owner</th>
            <th className="px-3 py-2 font-medium">Requests</th>
            <th className="px-3 py-2 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {collections.map((collection) => (
            <tr key={collection.id}>
              <td className="px-3 py-2">
                <p className="font-medium">{collection.name}</p>
                {collection.description ? (
                  <p className="text-xs text-muted-foreground">{collection.description}</p>
                ) : null}
              </td>
              <td className="px-3 py-2 text-muted-foreground">{collection.user.email}</td>
              <td className="px-3 py-2 text-muted-foreground">{collection._count.requests}</td>
              <td className="px-3 py-2 text-muted-foreground">
                {collection.createdAt.toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
