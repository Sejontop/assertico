import { flattenChanges } from "@/lib/diff";
import type { DiffNode } from "@/lib/diff";

interface DiffSummaryProps {
  node: DiffNode;
}

export function DiffSummary({ node }: DiffSummaryProps) {
  const changes = flattenChanges(node);

  if (changes.length === 0) {
    return <p className="text-sm text-success">No differences found.</p>;
  }

  const added = changes.filter((change) => change.status === "added").length;
  const removed = changes.filter((change) => change.status === "removed").length;
  const changed = changes.filter((change) => change.status === "changed").length;

  return (
    <p className="text-sm">
      <span className="text-success">{added} added</span>
      <span className="text-muted-foreground">, </span>
      <span className="text-destructive">{removed} removed</span>
      <span className="text-muted-foreground">, </span>
      <span className="text-amber-500">{changed} changed</span>
    </p>
  );
}
