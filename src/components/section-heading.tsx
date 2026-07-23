import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "center"
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base text-muted-foreground">{description}</p> : null}
    </div>
  );
}
