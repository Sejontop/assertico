import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="assertico-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="0.5" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#assertico-logo-gradient)" fillOpacity="0.16" />
        <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" stroke="url(#assertico-logo-gradient)" strokeOpacity="0.4" />
        <path
          d="M9 17.5L13.5 22L23 11"
          stroke="url(#assertico-logo-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark ? (
        <span className="font-mono text-base font-semibold tracking-tight text-foreground">
          assertico
        </span>
      ) : null}
    </div>
  );
}
