import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-md" />
      </div>
    </div>
  );
}
