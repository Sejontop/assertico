import { LogoutButton } from "@/components/auth/logout-button";

interface AdminNavbarProps {
  adminEmail: string;
}

export function AdminNavbar({ adminEmail }: AdminNavbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-black/5 bg-background/60 px-6 backdrop-blur-xl dark:border-white/10">
      <div className="flex items-center gap-2">
        <span className="rounded-md gradient-primary px-2 py-0.5 text-xs font-semibold text-white">
          ADMIN
        </span>
        <span className="text-sm text-muted-foreground">{adminEmail}</span>
      </div>
      <LogoutButton />
    </header>
  );
}
