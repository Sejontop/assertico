import type { AssertionOperator, AssertionType } from "@/types";

export const ASSERTION_TYPE_LABELS: Record<AssertionType, string> = {
  STATUS: "Status",
  BODY: "Body",
  HEADER: "Header",
  RESPONSE_TIME: "Response Time (ms)"
};

export const ASSERTION_OPERATOR_LABELS: Record<AssertionOperator, string> = {
  EQUALS: "equals",
  NOT_EQUALS: "not equals",
  CONTAINS: "contains",
  EXISTS: "exists",
  GREATER_THAN: "greater than",
  LESS_THAN: "less than",
  REGEX: "matches regex"
};