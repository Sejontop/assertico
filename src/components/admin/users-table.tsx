"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import { setUserRoleAction } from "@/app/admin/users/actions";

export interface AdminUserRow {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  _count: { collections: number; history: number };
}

interface UsersTableProps {
  users: AdminUserRow[];
  currentAdminId: string;
}

export function UsersTable({ users, currentAdminId }: UsersTableProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (users.length === 0) {
    return <EmptyState title="No users found" description="Try a different search term." />;
  }

  const handleToggleRole = (userId: string, currentRole: string) => {
    const nextRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const confirmed = window.confirm(
      `${nextRole === "ADMIN" ? "Promote" : "Demote"} this user to ${nextRole}?`
    );
    if (!confirmed) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await setUserRoleAction(userId, nextRole);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Collections</th>
              <th className="px-3 py-2 font-medium">Requests Sent</th>
              <th className="px-3 py-2 font-medium">Joined</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-3 py-2">
                  <Link href={`/admin/users?userId=${user.id}`} className="hover:underline">
                    {user.email}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      user.role === "ADMIN"
                        ? "font-semibold text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{user._count.collections}</td>
                <td className="px-3 py-2 text-muted-foreground">{user._count.history}</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {user.createdAt.toLocaleDateString()}
                </td>
                <td className="px-3 py-2 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending || user.id === currentAdminId}
                    onClick={() => handleToggleRole(user.id, user.role)}
                  >
                    {user.role === "ADMIN" ? "Demote" : "Promote"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
