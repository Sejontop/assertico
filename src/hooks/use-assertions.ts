"use client";

import { useCallback, useState } from "react";
import { createId } from "@/utils/id";
import type { AssertionDefinition } from "@/types";

function emptyAssertion(): AssertionDefinition {
  return {
    id: createId(),
    type: "STATUS",
    path: null,
    operator: "EQUALS",
    expectedValue: "200"
  };
}

export function useAssertions(initial?: AssertionDefinition[]) {
  const [assertions, setAssertions] = useState<AssertionDefinition[]>(
    initial ?? []
  );

  const addAssertion = useCallback(() => {
    setAssertions((prev) => [...prev, emptyAssertion()]);
  }, []);

  const updateAssertion = useCallback(
    (id: string, patch: Partial<Omit<AssertionDefinition, "id">>) => {
      setAssertions((prev) =>
        prev.map((assertion) =>
          assertion.id === id ? { ...assertion, ...patch } : assertion
        )
      );
    },
    []
  );

  const removeAssertion = useCallback((id: string) => {
    setAssertions((prev) => prev.filter((assertion) => assertion.id !== id));
  }, []);

  return { assertions, setAssertions, addAssertion, updateAssertion, removeAssertion };
}
