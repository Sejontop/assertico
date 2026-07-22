import { LogoutButton } from "@/components/auth/logout-button";

interface TopbarProps {
  userEmail: string;
}

export function Topbar({ userEmail }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <span className="text-sm text-muted-foreground">{userEmail}</span>
      <LogoutButton />
    </header>
  );
}
