import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center text-foreground">
      <h1 className="text-2xl font-semibold">403 — Forbidden</h1>
      <p className="text-sm text-muted-foreground">
        You don&apos;t have permission to view this page.
      </p>
      <Link href="/dashboard" className="text-sm text-primary hover:underline">
        Back to your dashboard
      </Link>
    </div>
  );
}
