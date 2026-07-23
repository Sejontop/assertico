"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/requests", label: "Requests" },
  { href: "/collections", label: "Collections" },
  { href: "/assertions", label: "Assertions" },
  { href: "/diff", label: "Diff Checker" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-black/5 bg-secondary/30 backdrop-blur-xl dark:border-white/10 md:block">
      <div className="px-4 py-5">
        <span className="font-mono text-sm font-semibold tracking-tight gradient-text">
          assertico
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
