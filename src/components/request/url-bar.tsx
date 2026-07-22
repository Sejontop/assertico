"use client";

import { MethodSelect } from "@/components/request/method-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { HttpMethod } from "@/types";

interface UrlBarProps {
  method: HttpMethod;
  onMethodChange: (method: HttpMethod) => void;
  url: string;
  onUrlChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function UrlBar({
  method,
  onMethodChange,
  url,
  onUrlChange,
  onSend,
  onCancel,
  isLoading
}: UrlBarProps) {
  return (
    <div className="flex items-center gap-2">
      <MethodSelect value={method} onChange={onMethodChange} />
      <Input
        value={url}
        onChange={(event) => onUrlChange(event.target.value)}
        placeholder="https://api.example.com/users"
        className="flex-1 font-mono"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSend();
          }
        }}
      />
      {isLoading ? (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      ) : (
        <Button type="button" onClick={onSend}>
          Send
        </Button>
      )}
    </div>
  );
}
