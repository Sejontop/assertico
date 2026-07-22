import { cn } from "@/utils/cn";

interface FormMessageProps {
  variant: "error" | "info";
  children: React.ReactNode;
}

export function FormMessage({ variant, children }: FormMessageProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md border px-3 py-2 text-sm",
        variant === "error"
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-primary/30 bg-primary/10 text-primary"
      )}
    >
      {children}
    </div>
  );
}
