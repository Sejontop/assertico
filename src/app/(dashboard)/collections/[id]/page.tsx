import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCollectionWithRequests } from "@/lib/collections";
import { SavedRequestList } from "@/components/collections/saved-request-list";
import { DeleteCollectionButton } from "@/components/collections/delete-collection-button";

interface CollectionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const collection = await getCollectionWithRequests(id, user.id);

  if (!collection) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <Link href="/collections" className="text-xs text-muted-foreground hover:underline">
            ← Collections
          </Link>
          <h1 className="text-lg font-semibold">{collection.name}</h1>
          {collection.description ? (
            <p className="text-sm text-muted-foreground">{collection.description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/requests?collectionId=${collection.id}`}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            New request
          </Link>
          <DeleteCollectionButton collectionId={collection.id} />
        </div>
      </div>
      <div className="p-6">
        <SavedRequestList collectionId={collection.id} requests={collection.requests} />
      </div>
    </div>
  );
}
