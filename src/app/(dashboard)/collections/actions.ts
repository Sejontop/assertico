"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { collectionSchema, savedRequestNameSchema } from "@/lib/validators";
import {
  createCollection,
  deleteCollection,
  deleteSavedRequest,
  saveRequestToCollection
} from "@/lib/collections";
import type { CollectionActionState } from "@/lib/collection-types";
import type { BodyType, HttpMethod } from "@/types";

// export interface CollectionActionState {
//   error: string | null;
// }

//export const initialCollectionState: CollectionActionState = { error: null };

export async function createCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be logged in." };
  }

  const parsed = collectionSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await createCollection(user.id, parsed.data.name, parsed.data.description);
  revalidatePath("/collections");
  return { error: null };
}

export async function deleteCollectionAction(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }
  await deleteCollection(id, user.id);
  revalidatePath("/collections");
  redirect("/collections");
}

export interface SaveRequestActionArgs {
  id?: string;
  collectionId: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: unknown;
  bodyType: BodyType;
}

export interface SaveRequestActionResult {
  error: string | null;
  savedRequestId: string | null;
}

export async function saveRequestAction(
  args: SaveRequestActionArgs
): Promise<SaveRequestActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be logged in.", savedRequestId: null };
  }

  const nameCheck = savedRequestNameSchema.safeParse(args.name);
  if (!nameCheck.success) {
    return {
      error: nameCheck.error.issues[0]?.message ?? "Invalid name",
      savedRequestId: null
    };
  }

  if (!args.collectionId) {
    return { error: "Choose a collection first", savedRequestId: null };
  }

  try {
    const saved = await saveRequestToCollection({
      id: args.id,
      collectionId: args.collectionId,
      userId: user.id,
      name: nameCheck.data,
      method: args.method,
      url: args.url,
      headers: args.headers,
      queryParams: args.queryParams,
      body: args.body,
      bodyType: args.bodyType
    });
    revalidatePath(`/collections/${args.collectionId}`);
    return { error: null, savedRequestId: saved.id };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save request",
      savedRequestId: null
    };
  }
}

export async function deleteSavedRequestAction(
  id: string,
  collectionId: string
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    return;
  }
  await deleteSavedRequest(id, user.id);
  revalidatePath(`/collections/${collectionId}`);
}
