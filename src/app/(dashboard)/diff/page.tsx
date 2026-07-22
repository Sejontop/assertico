import { DiffChecker } from "@/components/diff/diff-checker";

export default function DiffPage() {
  return (
    <div>
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold">Diff Checker</h1>
        <p className="text-sm text-muted-foreground">
          Compare two JSON responses and see exactly what changed.
        </p>
      </div>
      <DiffChecker />
    </div>
  );
}
