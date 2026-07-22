import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center text-foreground">
      <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
        Assertico
      </span>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        API testing, built for validation.
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Send requests, assert on the response, diff two payloads, and keep a
        history of everything you ran.
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
