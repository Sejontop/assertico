import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-[100px]" />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="glass rounded-2xl p-6 shadow-xl">{children}</div>
      </div>
    </div>
  );
}
