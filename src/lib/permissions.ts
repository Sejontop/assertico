import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@prisma/client";

export function isAdmin(user: User | null): boolean {
  return user?.role === "ADMIN";
}

/**
 * Guards every /admin/* route. Redirects unauthenticated visitors to the
 * existing login page, and authenticated non-admins to /forbidden.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdmin(user)) {
    redirect("/forbidden");
  }

  return user;
}
