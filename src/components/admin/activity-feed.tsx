import { MethodBadge } from "@/components/history/method-badge";
import { StatusPill } from "@/components/history/status-pill";
import { EmptyState } from "@/components/admin/empty-state";
import type { HttpMethod } from "@/types";

interface ActivityItem {
  id: string;
  method: HttpMethod;
  url: string;
  status: number;
  durationMs: number;
  createdAt: Date;
  user: { email: string };
}

interface ActivityFeedProps {
  activity: ActivityItem[];
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  if (activity.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Executions will show up here as users send requests."
      />
    );
  }

  return (
    <div className="divide-y divide-border rounded-md border border-border">
      {activity.map((item) => (
        <div
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
        >
          <div className="flex items-center gap-3">
            <MethodBadge method={item.method} />
            <span
              className="max-w-xs truncate font-mono text-xs text-muted-foreground"
              title={item.url}
            >
              {item.url}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{item.user.email}</span>
            <StatusPill status={item.status} />
            <span>{item.durationMs} ms</span>
            <span>{item.createdAt.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
