import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { HistoryStatusFilter } from "@/lib/history";
import type { HttpMethod } from "@/types";

interface HistoryFiltersProps {
  search?: string;
  method?: HttpMethod;
  status: HistoryStatusFilter;
}

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const STATUS_OPTIONS: { value: HistoryStatusFilter; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "SUCCESS", label: "2xx Success" },
  { value: "CLIENT_ERROR", label: "4xx Client Error" },
  { value: "SERVER_ERROR", label: "5xx Server Error" }
];

export function HistoryFilters({ search, method, status }: HistoryFiltersProps) {
  return (
    <form className="flex flex-wrap items-end gap-3" action="/history" method="GET">
      <div className="flex flex-col gap-1">
        <label htmlFor="q" className="text-xs text-muted-foreground">
          Search URL
        </label>
        <Input
          id="q"
          name="q"
          defaultValue={search}
          placeholder="api.example.com"
          className="w-56"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="method" className="text-xs text-muted-foreground">
          Method
        </label>
        <select
          id="method"
          name="method"
          defaultValue={method ?? ""}
          className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
        >
          <option value="">Any</option>
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-xs text-muted-foreground">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" variant="outline">
        Apply
      </Button>
    </form>
  );
}
