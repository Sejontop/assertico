"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/permissions";
import { setUserRole } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit";

export interface SetUserRoleResult {
  error: string | null;
}

export async function setUserRoleAction(
  userId: string,
  role: "USER" | "ADMIN"
): Promise<SetUserRoleResult> {
  const admin = await requireAdmin();

  if (admin.id === userId && role === "USER") {
    return { error: "You can't demote your own account." };
  }

  await setUserRole(userId, role);
  await logAdminAction({
    adminId: admin.id,
    action: role === "ADMIN" ? "PROMOTE_USER" : "DEMOTE_USER",
    targetType: "User",
    targetId: userId
  });

  revalidatePath("/admin/users");
  return { error: null };
}
