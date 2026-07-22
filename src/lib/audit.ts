import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface LogAdminActionInput {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}

export async function logAdminAction(input: LogAdminActionInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      adminId: input.adminId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: input.metadata as Prisma.InputJsonValue | undefined
    }
  });
}


export interface ListAuditLogsParams {
  page: number;
  pageSize: number;
}

export async function listAuditLogs(params: ListAuditLogsParams) {
  const { page, pageSize } = params;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { admin: { select: { email: true } } }
    }),
    prisma.auditLog.count()
  ]);

  return {
    logs,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
}
