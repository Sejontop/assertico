import { LogoutButton } from "@/components/auth/logout-button";

interface AdminNavbarProps {
  adminEmail: string;
}

export function AdminNavbar({ adminEmail }: AdminNavbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <div className="flex items-center gap-2">
        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          ADMIN
        </span>
        <span className="text-sm text-muted-foreground">{adminEmail}</span>
      </div>
      <LogoutButton />
    </header>
  );
}
