import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account.</p>
      </div>

      <div className="max-w-md space-y-6 p-6">
        <div className="rounded-md border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="truncate">{user.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Member since</dt>
              <dd>{user.createdAt.toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Session</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign out of your account on this device.
          </p>
          <div className="mt-3">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
