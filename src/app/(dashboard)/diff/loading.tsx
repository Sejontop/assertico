import { Skeleton } from "@/components/ui/skeleton";

export default function DiffLoading() {
  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
