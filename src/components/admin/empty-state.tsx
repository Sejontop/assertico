interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-border px-3 py-12 text-center text-sm">
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
