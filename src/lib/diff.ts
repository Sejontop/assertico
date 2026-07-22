export type DiffStatus = "added" | "removed" | "changed" | "unchanged";

export interface DiffNode {
  key: string;
  path: string;
  status: DiffStatus;
  leftValue: unknown;
  rightValue: unknown;
  children?: DiffNode[];
}

function isContainer(value: unknown): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === "object";
}

function getKeys(value: Record<string, unknown> | unknown[]): string[] {
  return Array.isArray(value)
    ? value.map((_, index) => String(index))
    : Object.keys(value);
}

/**
 * Recursively sorts object keys so two structurally-identical payloads with
 * differently ordered keys normalize to the same shape before comparison.
 * Array order is left untouched, since array order is usually meaningful.
 */
export function normalizeJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeJson);
  }

  if (isContainer(value)) {
    const sortedKeys = Object.keys(value).sort();
    const result: Record<string, unknown> = {};
    for (const key of sortedKeys) {
      result[key] = normalizeJson((value as Record<string, unknown>)[key]);
    }
    return result;
  }

  return value;
}

function diffNode(left: unknown, right: unknown, key: string, path: string): DiffNode {
  const leftIsContainer = isContainer(left);
  const rightIsContainer = isContainer(right);

  if (leftIsContainer || rightIsContainer) {
    const leftContainer: Record<string, unknown> | unknown[] = leftIsContainer
      ? (left as Record<string, unknown> | unknown[])
      : Array.isArray(right)
        ? []
        : {};
    const rightContainer: Record<string, unknown> | unknown[] = rightIsContainer
      ? (right as Record<string, unknown> | unknown[])
      : Array.isArray(left)
        ? []
        : {};

    const leftKeys = getKeys(leftContainer);
    const rightKeys = getKeys(rightContainer);
    const allKeys = Array.from(new Set([...leftKeys, ...rightKeys])).sort();

    const children = allKeys.map((childKey) => {
      const childPath = path ? `${path}.${childKey}` : childKey;
      const leftChild = (leftContainer as Record<string, unknown>)[childKey];
      const rightChild = (rightContainer as Record<string, unknown>)[childKey];
      return diffNode(leftChild, rightChild, childKey, childPath);
    });

    let status: DiffStatus;
    if (left === undefined && right !== undefined) {
      status = "added";
    } else if (left !== undefined && right === undefined) {
      status = "removed";
    } else {
      status = children.every((child) => child.status === "unchanged")
        ? "unchanged"
        : "changed";
    }

    return { key, path, status, leftValue: left, rightValue: right, children };
  }

  if (left === undefined && right !== undefined) {
    return { key, path, status: "added", leftValue: left, rightValue: right };
  }
  if (left !== undefined && right === undefined) {
    return { key, path, status: "removed", leftValue: left, rightValue: right };
  }

  return {
    key,
    path,
    status: left === right ? "unchanged" : "changed",
    leftValue: left,
    rightValue: right
  };
}

export function diffResponses(left: unknown, right: unknown): DiffNode {
  return diffNode(normalizeJson(left), normalizeJson(right), "root", "");
}

/**
 * Flattens a diff tree into only the nodes that actually changed, skipping
 * whole unchanged subtrees entirely. Used for the pass/fail-style summary
 * counts rather than for rendering (rendering walks the full tree so
 * structure/context is preserved).
 */
export function flattenChanges(node: DiffNode): DiffNode[] {
  const results: DiffNode[] = [];

  function walk(current: DiffNode) {
    if (current.status === "unchanged") {
      return;
    }

    if (!current.children || current.status === "added" || current.status === "removed") {
      results.push(current);
      return;
    }

    current.children.forEach(walk);
  }

  walk(node);
  return results;
}

export type DiffOutcome = { diff: DiffNode } | { error: string };

/**
 * Parses two raw response bodies as JSON and diffs them. Explicitly
 * rejects plain-string/primitive input at the top level: this tool
 * compares JSON structures, not arbitrary text, so a bare string or number
 * response is treated as an error rather than silently falling back to a
 * character-level string diff.
 */
export function safeDiffResponses(leftRaw: string, rightRaw: string): DiffOutcome {
  let leftParsed: unknown;
  let rightParsed: unknown;

  try {
    leftParsed = JSON.parse(leftRaw);
  } catch {
    return { error: "Response A is not valid JSON" };
  }

  try {
    rightParsed = JSON.parse(rightRaw);
  } catch {
    return { error: "Response B is not valid JSON" };
  }

  if (!isContainer(leftParsed) || !isContainer(rightParsed)) {
    return {
      error:
        "Both responses must be JSON objects or arrays — plain strings or primitives can't be diffed here"
    };
  }

  return { diff: diffResponses(leftParsed, rightParsed) };
}
