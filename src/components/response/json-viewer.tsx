import { highlightJson } from "@/utils/json-highlight";

interface JsonViewerProps {
  value: unknown;
}

export function JsonViewer({ value }: JsonViewerProps) {
  const segments = highlightJson(value);

  return (
    <pre className="overflow-auto rounded-md border border-border bg-background p-3 font-mono text-xs leading-relaxed">
      {segments.map((segment, index) => (
        <span key={index} className={segment.className}>
          {segment.text}
        </span>
      ))}
    </pre>
  );
}
