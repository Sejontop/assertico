import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, BarChart3, CheckCircle2, Timer, XCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardStats, getRecentActivity } from "@/lib/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { HistoryTable } from "@/components/history/history-table";

const RECENT_ACTIVITY_LIMIT = 10;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const [stats, recentActivity] = await Promise.all([
    getDashboardStats(user.id),
    getRecentActivity(user.id, RECENT_ACTIVITY_LIMIT)
  ]);

  const hasActivity = stats.totalRequests > 0;

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          An overview of your API testing activity.
        </p>
      </div>

      <div className="space-y-6 p-6">
        {!hasActivity ? (
          <div className="rounded-md border border-dashed border-border px-3 py-12 text-center text-sm text-muted-foreground">
            No requests yet.{" "}
            <Link href="/requests" className="text-primary hover:underline">
              Send your first request
            </Link>{" "}
            to see stats here.
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard
                label="Total Requests"
                value={String(stats.totalRequests)}
                icon={Activity}
              />
              <StatCard
                label="Assertions Passed"
                value={String(stats.assertionsPassed)}
                icon={CheckCircle2}
                accentClassName="text-success"
              />
              <StatCard
                label="Assertions Failed"
                value={String(stats.assertionsFailed)}
                icon={XCircle}
                accentClassName="text-destructive"
              />
              <StatCard
                label="Avg Response Time"
                value={`${stats.averageResponseTimeMs} ms`}
                icon={Timer}
              />
              <StatCard
                label="Most Used Method"
                value={stats.mostUsedMethod ?? "—"}
                icon={BarChart3}
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-semibold">Recent Activity</h2>
              <HistoryTable entries={recentActivity} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
