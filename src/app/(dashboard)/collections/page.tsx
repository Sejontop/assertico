import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listCollectionsWithCounts } from "@/lib/collections";
import { CreateCollectionForm } from "@/components/collections/create-collection-form";
import { CollectionList } from "@/components/collections/collection-list";

export default async function CollectionsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const collections = await listCollectionsWithCounts(user.id);

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Collections</h1>
        <p className="text-sm text-muted-foreground">
          Group related requests together.
        </p>
      </div>
      <div className="space-y-6 p-6">
        <CreateCollectionForm />
        <CollectionList collections={collections} />
      </div>
    </div>
  );
}
