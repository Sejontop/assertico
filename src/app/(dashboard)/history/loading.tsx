import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="space-y-4 p-6">
        <Skeleton className="h-9 w-full max-w-2xl" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
