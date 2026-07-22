import type { HttpMethod } from "@/types";

export const METHOD_TEXT_COLORS: Record<HttpMethod, string> = {
  GET: "text-blue-500",
  POST: "text-success",
  PUT: "text-amber-500",
  PATCH: "text-purple-500",
  DELETE: "text-destructive"
};
