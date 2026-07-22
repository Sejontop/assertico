export interface JsonSegment {
  text: string;
  className: string;
}

const TOKEN_REGEX =
  /("(?:\\u[a-fA-F0-9]{4}|\\.|[^\\"])*"(\s*:)?)|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

export function highlightJson(value: unknown): JsonSegment[] {
  if (value === undefined) {
    return [{ text: "undefined", className: "text-muted-foreground" }];
  }

  const pretty = JSON.stringify(value, null, 2) ?? "null";
  const segments: JsonSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(pretty)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: pretty.slice(lastIndex, match.index),
        className: "text-foreground"
      });
    }

    const token = match[0];
    segments.push({ text: token, className: classifyToken(token) });
    lastIndex = match.index + token.length;
  }

  if (lastIndex < pretty.length) {
    segments.push({
      text: pretty.slice(lastIndex),
      className: "text-foreground"
    });
  }

  return segments;
}

function classifyToken(token: string): string {
  if (token.startsWith('"')) {
    return token.trimEnd().endsWith(":") ? "text-blue-400" : "text-success";
  }
  if (token === "true" || token === "false") {
    return "text-purple-400";
  }
  if (token === "null") {
    return "text-muted-foreground";
  }
  return "text-amber-500";
}
