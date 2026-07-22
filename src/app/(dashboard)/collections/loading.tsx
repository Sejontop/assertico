import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>
      <div className="space-y-6 p-6">
        <Skeleton className="h-40 w-full max-w-md" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
