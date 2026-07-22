import { CheckCircle2 } from "lucide-react";
import { getAdminAnalytics } from "@/lib/admin";
import { StatsCard } from "@/components/admin/stats-card";
import { EmptyState } from "@/components/admin/empty-state";

export default async function AdminAnalyticsPage() {
  const analytics = await getAdminAnalytics();

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Basic platform statistics.</p>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Assertion Pass Rate"
            value={analytics.assertionPassRate !== null ? `${analytics.assertionPassRate}%` : "—"}
            icon={CheckCircle2}
            accentClassName="text-success"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Requests by Method</h2>
            {analytics.methodBreakdown.length === 0 ? (
              <EmptyState title="No executions yet" />
            ) : (
              <div className="divide-y divide-border rounded-md border border-border">
                {analytics.methodBreakdown.map((item) => (
                  <div
                    key={item.method}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <span className="font-mono">{item.method}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Responses by Status</h2>
            <div className="divide-y divide-border rounded-md border border-border">
              {analytics.statusBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-4 py-2 text-sm"
                >
                  <span>{item.label}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Top 5 Most Active Users</h2>
          {analytics.topUsers.length === 0 ? (
            <EmptyState title="No activity yet" />
          ) : (
            <div className="divide-y divide-border rounded-md border border-border">
              {analytics.topUsers.map((user, index) => (
                <div
                  key={`${user.email}-${index}`}
                  className="flex items-center justify-between px-4 py-2 text-sm"
                >
                  <span>{user.email}</span>
                  <span className="text-muted-foreground">{user.executionCount} executions</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
