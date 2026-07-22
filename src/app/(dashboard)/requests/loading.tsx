import { Skeleton } from "@/components/ui/skeleton";

export default function RequestsLoading() {
  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>
      <div className="space-y-4 p-6">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
