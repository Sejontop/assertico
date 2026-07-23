import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-background dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              An all-in-one API validation workspace for developers who ship
              with confidence.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-foreground">
                  Workflow
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 pt-6 text-xs text-muted-foreground dark:border-white/10">
          © {new Date().getFullYear()} Assertico. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
