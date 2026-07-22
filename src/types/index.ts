export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type BodyType = "NONE" | "JSON" | "RAW" | "FORM_DATA";

export type AssertionType = "STATUS" | "BODY" | "HEADER";

export type AssertionOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "CONTAINS"
  | "EXISTS"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "REGEX";

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface AssertionDefinition {
  id: string;
  type: AssertionType;
  path: string | null;
  operator: AssertionOperator;
  expectedValue: string;
}

export interface AssertionResult {
  id: string;
  passed: boolean;
  message: string;
}

export interface RequestDraft {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  bodyType: BodyType;
  body: string;
  assertions: AssertionDefinition[];
}

export interface ExecutedResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  rawBody: string;
  isJson: boolean;
  durationMs: number;
  sizeBytes: number;
}

export interface DashboardStats {
  totalRequests: number;
  assertionsPassed: number;
  assertionsFailed: number;
  averageResponseTimeMs: number;
  mostUsedMethod: HttpMethod | null;
}
