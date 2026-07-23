import { LogoutButton } from "@/components/auth/logout-button";

interface TopbarProps {
  userEmail: string;
}

export function Topbar({ userEmail }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-black/5 bg-background/60 px-6 backdrop-blur-xl dark:border-white/10">
      <span className="text-sm text-muted-foreground">{userEmail}</span>
      <LogoutButton />
    </header>
  );
}
