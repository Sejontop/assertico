interface HeadersTableProps {
  headers: Record<string, string>;
}

export function HeadersTable({ headers }: HeadersTableProps) {
  const entries = Object.entries(headers);

  if (entries.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No headers returned.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border rounded-md border border-border">
      {entries.map(([key, value]) => (
        <div key={key} className="flex gap-3 px-3 py-2 text-sm">
          <span className="w-1/3 shrink-0 font-mono text-muted-foreground">
            {key}
          </span>
          <span className="flex-1 break-all font-mono">{value}</span>
        </div>
      ))}
    </div>
  );
}
