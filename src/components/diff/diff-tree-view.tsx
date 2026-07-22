import { cn } from "@/utils/cn";
import type { DiffNode, DiffStatus } from "@/lib/diff";

interface DiffTreeViewProps {
  node: DiffNode;
  depth?: number;
}

function statusClassName(status: DiffStatus): string {
  switch (status) {
    case "added":
      return "bg-success/10";
    case "removed":
      return "bg-destructive/10";
    case "changed":
      return "bg-amber-500/10";
    default:
      return "";
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) return "—";
  if (typeof value === "string") return `"${value}"`;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function DiffTreeView({ node, depth = 0 }: DiffTreeViewProps) {
  const isRoot = node.key === "root";
  const isArrayLike = Array.isArray(node.leftValue) || Array.isArray(node.rightValue);

  if (node.children) {
    return (
      <div style={{ marginLeft: isRoot ? 0 : 16 }}>
        {!isRoot ? (
          <div
            className={cn(
              "rounded px-1 font-mono text-xs font-medium",
              statusClassName(node.status)
            )}
          >
            {node.key}: {isArrayLike ? "[" : "{"}
          </div>
        ) : null}

        {node.children.map((child) => (
          <DiffTreeView key={child.path} node={child} depth={depth + 1} />
        ))}

        {!isRoot ? (
          <div className="font-mono text-xs text-muted-foreground">
            {isArrayLike ? "]" : "}"}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-2 rounded px-1 py-0.5 font-mono text-xs",
        statusClassName(node.status)
      )}
      style={{ marginLeft: 16 }}
    >
      <span className="text-muted-foreground">{node.key}:</span>
      {node.status === "changed" ? (
        <>
          <span className="text-destructive line-through">
            {describeValue(node.leftValue)}
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="text-success">{describeValue(node.rightValue)}</span>
        </>
      ) : node.status === "added" ? (
        <span className="text-success">{describeValue(node.rightValue)}</span>
      ) : node.status === "removed" ? (
        <span className="text-destructive line-through">
          {describeValue(node.leftValue)}
        </span>
      ) : (
        <span className="text-foreground">{describeValue(node.leftValue)}</span>
      )}
    </div>
  );
}
