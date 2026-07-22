"use client";

import { useCallback, useState } from "react";
import { createId } from "@/utils/id";
import type { KeyValuePair } from "@/types";

function emptyPair(): KeyValuePair {
  return { id: createId(), key: "", value: "", enabled: true };
}

export function useKeyValuePairs(initial?: KeyValuePair[]) {
  const [pairs, setPairs] = useState<KeyValuePair[]>(
    initial && initial.length > 0 ? initial : [emptyPair()]
  );

  const addPair = useCallback(() => {
    setPairs((prev) => [...prev, emptyPair()]);
  }, []);

  const updatePair = useCallback(
    (id: string, field: "key" | "value", value: string) => {
      setPairs((prev) =>
        prev.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair))
      );
    },
    []
  );

  const togglePair = useCallback((id: string) => {
    setPairs((prev) =>
      prev.map((pair) =>
        pair.id === id ? { ...pair, enabled: !pair.enabled } : pair
      )
    );
  }, []);

  const removePair = useCallback((id: string) => {
    setPairs((prev) => prev.filter((pair) => pair.id !== id));
  }, []);

  return { pairs, setPairs, addPair, updatePair, togglePair, removePair };
}
