"use client";

import { useCallback, useState } from "react";

export function useCopyToClipboard(resetDelayMs = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelayMs);
      } catch {
        setCopied(false);
      }
    },
    [resetDelayMs]
  );

  return { copied, copy };
}
