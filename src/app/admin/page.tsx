import { Activity, FileStack, FolderKanban, Users } from "lucide-react";
import { getAdminStats, getRecentAdminActivity } from "@/lib/admin";
import { StatsCard } from "@/components/admin/stats-card";
import { ActivityFeed } from "@/components/admin/activity-feed";

const RECENT_ACTIVITY_LIMIT = 10;

export default async function AdminDashboardPage() {
  const [stats, activity] = await Promise.all([
    getAdminStats(),
    getRecentAdminActivity(RECENT_ACTIVITY_LIMIT)
  ]);

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform-wide overview.</p>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Total Users" value={String(stats.totalUsers)} icon={Users} />
          <StatsCard
            label="Total Collections"
            value={String(stats.totalCollections)}
            icon={FolderKanban}
          />
          <StatsCard
            label="Saved Requests"
            value={String(stats.totalRequests)}
            icon={FileStack}
          />
          <StatsCard
            label="Total Executions"
            value={String(stats.totalExecutions)}
            icon={Activity}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Recent Activity</h2>
          <ActivityFeed activity={activity} />
        </div>
      </div>
    </div>
  );
}
