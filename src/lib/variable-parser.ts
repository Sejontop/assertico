export interface InterpolationContext {
  variables: Record<string, string | number | boolean>;
}

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

export function interpolateString(template: string, context: InterpolationContext): string {
  if (!template || !template.includes("{{")) {
    return template;
  }

  return template.replace(VARIABLE_REGEX, (match, key: string) => {
    const trimmedKey = key.trim();
    if (Object.prototype.hasOwnProperty.call(context.variables, trimmedKey)) {
      const val = context.variables[trimmedKey];
      return val !== undefined && val !== null ? String(val) : "";
    }
    return match;
  });
}

export function interpolateHeaders(
  headers: Record<string, string>,
  context: InterpolationContext
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    const resolvedKey = interpolateString(k, context);
    const resolvedValue = interpolateString(v, context);
    result[resolvedKey] = resolvedValue;
  }
  return result;
}

export function interpolateUnknown(target: unknown, context: InterpolationContext): unknown {
  if (typeof target === "string") {
    return interpolateString(target, context);
  }
  if (Array.isArray(target)) {
    return target.map((item) => interpolateUnknown(item, context));
  }
  if (target !== null && typeof target === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(target as Record<string, unknown>)) {
      result[interpolateString(k, context)] = interpolateUnknown(v, context);
    }
    return result;
  }
  return target;
}