import type {
  AssertionDefinition,
  AssertionOperator,
  AssertionResult,
  AssertionType
} from "@/types";

export interface AssertionContext {
  status: number;
  body: unknown;
  headers: Record<string, string>;
  responseTimeMs: number;
}

interface PathLookup {
  found: boolean;
  value: unknown;
}

export function getValueByPath(source: unknown, path: string): PathLookup {
  const segments = path.split(".").filter((segment) => segment.length > 0);

  if (segments.length === 0) {
    return { found: true, value: source };
  }

  let current: unknown = source;

  for (const segment of segments) {
    if (current === null || current === undefined || typeof current !== "object") {
      return { found: false, value: undefined };
    }

    if (!(segment in (current as Record<string, unknown>))) {
      return { found: false, value: undefined };
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return { found: true, value: current };
}

function valuesLooselyEqual(actual: unknown, expected: string): boolean {
  if (typeof actual === "number") {
    const expectedNumber = Number(expected);
    return !Number.isNaN(expectedNumber) && actual === expectedNumber;
  }

  if (typeof actual === "boolean") {
    return String(actual) === expected.trim().toLowerCase();
  }

  if (actual === null) {
    return expected.trim().toLowerCase() === "null";
  }

  return String(actual) === expected;
}

function containsExpected(actual: unknown, expected: string): boolean {
  if (typeof actual === "string") {
    return actual.includes(expected);
  }

  if (Array.isArray(actual)) {
    return actual.some(
      (item) =>
        valuesLooselyEqual(item, expected) ||
        (typeof item === "string" && item.includes(expected))
    );
  }

  if (actual !== null && typeof actual === "object") {
    return JSON.stringify(actual).includes(expected);
  }

  if (actual === undefined || actual === null) {
    return false;
  }

  return String(actual).includes(expected);
}

function toFiniteNumber(value: unknown): number | null {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}

function describeValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `"${value}"`;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function resolveSubject(
  definition: AssertionDefinition,
  context: AssertionContext
): { found: boolean; value: unknown; label: string } {
  const type: AssertionType = definition.type;

  if (type === "STATUS") {
    return { found: true, value: context.status, label: "status" };
  }

  if (type === "RESPONSE_TIME") {
    return {
      found: true,
      value: context.responseTimeMs,
      label: "response time"
    };
  }

  if (type === "HEADER") {
    const headerName = (definition.path ?? "").trim();
    const match = Object.entries(context.headers).find(
      ([key]) => key.toLowerCase() === headerName.toLowerCase()
    );
    return {
      found: match !== undefined,
      value: match ? match[1] : undefined,
      label: `header "${headerName}"`
    };
  }

  const path = (definition.path ?? "").trim();
  const { found, value } = getValueByPath(context.body, path);
  return { found, value, label: path ? `body.${path}` : "body" };
}

export function runAssertion(
  definition: AssertionDefinition,
  context: AssertionContext
): AssertionResult {
  const { found, value, label } = resolveSubject(definition, context);
  const operator: AssertionOperator = definition.operator;

  if (operator === "EXISTS") {
    const expectPresence = definition.expectedValue.trim().toLowerCase() !== "false";
    const passed = expectPresence ? found : !found;
    return {
      id: definition.id,
      passed,
      message: passed
        ? `${label} ${expectPresence ? "exists" : "does not exist"}, as expected`
        : `Expected ${label} to ${expectPresence ? "exist" : "not exist"}, but it ${
            found ? "exists" : "does not exist"
          }`
    };
  }

  if (!found) {
    return {
      id: definition.id,
      passed: false,
      message: `${label} was not found in the response`
    };
  }

  switch (operator) {
    case "EQUALS": {
      const passed = valuesLooselyEqual(value, definition.expectedValue);
      const suffix = definition.type === "RESPONSE_TIME" ? "ms" : "";
      return {
        id: definition.id,
        passed,
        message: passed
          ? `${label} equals ${describeValue(value)}${suffix}`
          : `Expected ${label} to equal "${definition.expectedValue}${suffix}", got ${describeValue(value)}${suffix}`
      };
    }

    case "NOT_EQUALS": {
      const passed = !valuesLooselyEqual(value, definition.expectedValue);
      const suffix = definition.type === "RESPONSE_TIME" ? "ms" : "";
      return {
        id: definition.id,
        passed,
        message: passed
          ? `${label} does not equal "${definition.expectedValue}${suffix}"`
          : `Expected ${label} to not equal "${definition.expectedValue}${suffix}"`
      };
    }

    case "CONTAINS": {
      const passed = containsExpected(value, definition.expectedValue);
      return {
        id: definition.id,
        passed,
        message: passed
          ? `${label} contains "${definition.expectedValue}"`
          : `Expected ${label} to contain "${definition.expectedValue}", got ${describeValue(value)}`
      };
    }

    case "GREATER_THAN": {
      const actualNumber = toFiniteNumber(value);
      const expectedNumber = toFiniteNumber(definition.expectedValue);
      if (actualNumber === null || expectedNumber === null) {
        return {
          id: definition.id,
          passed: false,
          message: `${label} (${describeValue(value)}) is not numeric`
        };
      }
      const passed = actualNumber > expectedNumber;
      const unit = definition.type === "RESPONSE_TIME" ? "ms" : "";
      return {
        id: definition.id,
        passed,
        message: passed
          ? `${label} (${actualNumber}${unit}) is greater than ${expectedNumber}${unit}`
          : `Expected ${label} (${actualNumber}${unit}) to be greater than ${expectedNumber}${unit}`
      };
    }

    case "LESS_THAN": {
      const actualNumber = toFiniteNumber(value);
      const expectedNumber = toFiniteNumber(definition.expectedValue);
      if (actualNumber === null || expectedNumber === null) {
        return {
          id: definition.id,
          passed: false,
          message: `${label} (${describeValue(value)}) is not numeric`
        };
      }
      const passed = actualNumber < expectedNumber;
      const unit = definition.type === "RESPONSE_TIME" ? "ms" : "";
      return {
        id: definition.id,
        passed,
        message: passed
          ? `${label} (${actualNumber}${unit}) is less than ${expectedNumber}${unit}`
          : `Expected ${label} (${actualNumber}${unit}) to be less than ${expectedNumber}${unit}`
      };
    }

    case "REGEX": {
      try {
        const pattern = new RegExp(definition.expectedValue);
        const passed = pattern.test(String(value));
        return {
          id: definition.id,
          passed,
          message: passed
            ? `${label} matches /${definition.expectedValue}/`
            : `Expected ${label} (${describeValue(value)}) to match /${definition.expectedValue}/`
        };
      } catch {
        return {
          id: definition.id,
          passed: false,
          message: `"${definition.expectedValue}" is not a valid regular expression`
        };
      }
    }

    default:
      return {
        id: definition.id,
        passed: false,
        message: `Unknown operator`
      };
  }
}

export function runAssertions(
  definitions: AssertionDefinition[],
  context: AssertionContext
): AssertionResult[] {
  return definitions.map((definition) => runAssertion(definition, context));
}