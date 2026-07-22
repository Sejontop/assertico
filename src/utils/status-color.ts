export function statusColorClassName(status: number): string {
  if (status >= 200 && status < 300) return "bg-success/15 text-success";
  if (status >= 300 && status < 400) return "bg-blue-500/15 text-blue-400";
  if (status >= 400 && status < 500) return "bg-amber-500/15 text-amber-500";
  return "bg-destructive/15 text-destructive";
}
