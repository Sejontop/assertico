import { prisma } from "@/lib/prisma";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [totalRequests, aggregates, topMethod] = await Promise.all([
    prisma.requestHistory.count({ where: { userId } }),
    prisma.requestHistory.aggregate({
      where: { userId },
      _sum: { assertionsPassed: true, assertionsFailed: true },
      _avg: { durationMs: true }
    }),
    prisma.requestHistory.groupBy({
      by: ["method"],
      where: { userId },
      _count: { method: true },
      orderBy: { _count: { method: "desc" } },
      take: 1
    })
  ]);

  return {
    totalRequests,
    assertionsPassed: aggregates._sum.assertionsPassed ?? 0,
    assertionsFailed: aggregates._sum.assertionsFailed ?? 0,
    averageResponseTimeMs: Math.round(aggregates._avg.durationMs ?? 0),
    mostUsedMethod: topMethod[0]?.method ?? null
  };
}

export async function getRecentActivity(userId: string, limit: number) {
  return prisma.requestHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit
  });
}
