export type RiskLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AIDiffAnalysis {
  summary: string;
  riskLevel: RiskLevel;
  isBreakingChange: boolean;
  breakingDetails: string[];
  securityWarnings: string[];
  performanceInsight: string | null;
  recommendedPayload: "A" | "B" | "NEITHER";
  recommendationReason: string;
}

export interface DiffChangeSummaryItem {
  path: string;
  status: "added" | "removed" | "changed";
  leftValue: unknown;
  rightValue: unknown;
}