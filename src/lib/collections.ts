import { prisma } from "@/lib/prisma";
import type { BodyType, HttpMethod } from "@/types";
import type { Prisma } from "@prisma/client";

export async function listCollectionsWithCounts(userId: string) {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { requests: true } } }
  });
}

export async function createCollection(userId: string, name: string, description?: string) {
  return prisma.collection.create({
    data: { userId, name, description: description || null }
  });
}

export async function deleteCollection(id: string, userId: string): Promise<void> {
  await prisma.collection.deleteMany({ where: { id, userId } });
}

export async function getCollectionWithRequests(id: string, userId: string) {
  return prisma.collection.findFirst({
    where: { id, userId },
    include: { requests: { orderBy: { updatedAt: "desc" } } }
  });
}

export interface SaveRequestInput {
  id?: string;
  collectionId: string;
  userId: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: unknown;
  bodyType: BodyType;
}

export async function saveRequestToCollection(input: SaveRequestInput) {
  const collection = await prisma.collection.findFirst({
    where: { id: input.collectionId, userId: input.userId },
    select: { id: true }
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  const data = {
    name: input.name,
    method: input.method,
    url: input.url,
    headers: (input.headers ?? {}) as Prisma.InputJsonValue,
    queryParams: (input.queryParams ?? {}) as Prisma.InputJsonValue,
    body: (input.body ?? null) as Prisma.InputJsonValue,
    bodyType: input.bodyType,
    collectionId: input.collectionId
  };

  if (input.id) {
    // Re-verify the existing request also belongs to this user's
    // collection before allowing an update, not just the target collection.
    const existing = await prisma.request.findFirst({
      where: { id: input.id, collection: { userId: input.userId } },
      select: { id: true }
    });
    if (!existing) {
      throw new Error("Request not found");
    }
    return prisma.request.update({ where: { id: input.id }, data });
  }

  return prisma.request.create({ data });
}

export async function deleteSavedRequest(id: string, userId: string): Promise<void> {
  await prisma.request.deleteMany({ where: { id, collection: { userId } } });
}

export async function getSavedRequest(id: string, userId: string) {
  return prisma.request.findFirst({ where: { id, collection: { userId } } });
}
