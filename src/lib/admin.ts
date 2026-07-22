import { prisma } from "@/lib/prisma";
import type { AdminStats } from "@/types/admin";
import type { Prisma } from "@prisma/client";

export async function getAdminStats(): Promise<AdminStats> {
  const [totalUsers, totalCollections, totalRequests, totalExecutions] = await Promise.all([
    prisma.user.count(),
    prisma.collection.count(),
    prisma.request.count(),
    prisma.requestHistory.count()
  ]);

  return { totalUsers, totalCollections, totalRequests, totalExecutions };
}

export async function getRecentAdminActivity(limit: number) {
  return prisma.requestHistory.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { email: true } } }
  });
}


export interface ListUsersParams {
  search?: string;
  page: number;
  pageSize: number;
}

export async function listUsers(params: ListUsersParams) {
  const { search, page, pageSize } = params;
  const where: Prisma.UserWhereInput = search
    ? { email: { contains: search, mode: "insensitive" } }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { collections: true, history: true } } }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
}

export async function getUserDetail(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { collections: true, history: true } } }
  });
}

export async function setUserRole(id: string, role: "USER" | "ADMIN") {
  return prisma.user.update({ where: { id }, data: { role } });
}


export interface ListCollectionsParams {
  search?: string;
  page: number;
  pageSize: number;
}

export async function listAllCollections(params: ListCollectionsParams) {
  const { search, page, pageSize } = params;
  const where: Prisma.CollectionWhereInput = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  const [collections, total] = await Promise.all([
    prisma.collection.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { email: true } },
        _count: { select: { requests: true } }
      }
    }),
    prisma.collection.count({ where })
  ]);

  return {
    collections,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
}


export interface ListRequestsParams {
  userId?: string;
  page: number;
  pageSize: number;
}

export async function listAllRequests(params: ListRequestsParams) {
  const { userId, page, pageSize } = params;
  const where: Prisma.RequestWhereInput = userId ? { collection: { userId } } : {};

  const [requests, total] = await Promise.all([
    prisma.request.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { collection: { include: { user: { select: { email: true } } } } }
    }),
    prisma.request.count({ where })
  ]);

  return {
    requests,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
}


export async function listUsersForFilter() {
  return prisma.user.findMany({
    orderBy: { email: "asc" },
    select: { id: true, email: true }
  });
}


export interface ListAdminHistoryParams {
  userId?: string;
  page: number;
  pageSize: number;
}

export async function listAllHistory(params: ListAdminHistoryParams) {
  const { userId, page, pageSize } = params;
  const where: Prisma.RequestHistoryWhereInput = userId ? { userId } : {};

  const [entries, total] = await Promise.all([
    prisma.requestHistory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { email: true } } }
    }),
    prisma.requestHistory.count({ where })
  ]);

  return {
    entries,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
}


export interface MethodBreakdownItem {
  method: string;
  count: number;
}

export interface StatusBreakdownItem {
  label: string;
  count: number;
}

export interface TopUserItem {
  email: string;
  executionCount: number;
}

export interface AdminAnalytics {
  methodBreakdown: MethodBreakdownItem[];
  statusBreakdown: StatusBreakdownItem[];
  assertionPassRate: number | null;
  topUsers: TopUserItem[];
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const [methodGroups, statusCounts, assertionSums, topUserGroups] = await Promise.all([
    prisma.requestHistory.groupBy({
      by: ["method"],
      _count: { method: true },
      orderBy: { _count: { method: "desc" } }
    }),
    Promise.all([
      prisma.requestHistory.count({ where: { status: { gte: 200, lt: 300 } } }),
      prisma.requestHistory.count({ where: { status: { gte: 300, lt: 400 } } }),
      prisma.requestHistory.count({ where: { status: { gte: 400, lt: 500 } } }),
      prisma.requestHistory.count({ where: { status: { gte: 500, lt: 600 } } })
    ]),
    prisma.requestHistory.aggregate({
      _sum: { assertionsPassed: true, assertionsFailed: true }
    }),
    prisma.requestHistory.groupBy({
      by: ["userId"],
      _count: { userId: true },
      orderBy: { _count: { userId: "desc" } },
      take: 5
    })
  ]);

  const [success, redirectCount, clientError, serverError] = statusCounts;

  const passed = assertionSums._sum.assertionsPassed ?? 0;
  const failed = assertionSums._sum.assertionsFailed ?? 0;
  const totalAssertions = passed + failed;

  const topUserIds = topUserGroups.map((group) => group.userId);
  const topUserRecords =
    topUserIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: topUserIds } },
          select: { id: true, email: true }
        })
      : [];
  const emailById = new Map(topUserRecords.map((user) => [user.id, user.email]));

  return {
    methodBreakdown: methodGroups.map((group) => ({
      method: group.method,
      count: group._count.method
    })),
    statusBreakdown: [
      { label: "2xx Success", count: success },
      { label: "3xx Redirect", count: redirectCount },
      { label: "4xx Client Error", count: clientError },
      { label: "5xx Server Error", count: serverError }
    ],
    assertionPassRate:
      totalAssertions > 0 ? Math.round((passed / totalAssertions) * 1000) / 10 : null,
    topUsers: topUserGroups.map((group) => ({
      email: emailById.get(group.userId) ?? "Unknown",
      executionCount: group._count.userId
    }))
  };
}
