"use client";

import type { AIDiffAnalysis, RiskLevel } from "@/types/ai-diff";

const RISK_STYLES: Record<RiskLevel, string> = {
  NONE: "border-green-500/30 bg-green-500/10 text-green-400",
  LOW: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  MEDIUM: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  CRITICAL: "border-red-500/30 bg-red-500/10 text-red-400"
};

interface AiDiffCardProps {
  analysis: AIDiffAnalysis | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  disabled?: boolean;
}

export function AiDiffCard({
  analysis,
  isAnalyzing,
  onAnalyze,
  disabled
}: AiDiffCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">AI Semantic Contract Diagnostic</h3>
          <p className="text-xs text-muted-foreground">
            Evaluates backward compatibility, breaking schema changes, and latency shifts.
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={disabled || isAnalyzing}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isAnalyzing ? "Analyzing AST & Telemetry..." : "Run AI Contract Review"}
        </button>
      </div>

      {analysis ? (
        <div className="space-y-4 pt-2 border-t border-border">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                RISK_STYLES[analysis.riskLevel]
              }`}
            >
              Risk: {analysis.riskLevel}
            </span>

            <span
              className={`text-xs font-medium ${
                analysis.isBreakingChange ? "text-destructive" : "text-green-500"
              }`}
            >
              {analysis.isBreakingChange ? "⚠ Breaking Changes Detected" : "✔ Backward Compatible"}
            </span>

            <span className="text-xs text-muted-foreground ml-auto">
              Recommended: <strong className="text-foreground">Payload {analysis.recommendedPayload}</strong>
            </span>
          </div>

          <p className="text-xs text-foreground/90 font-mono bg-muted/30 p-2.5 rounded">
            {analysis.summary}
          </p>

          {analysis.breakingDetails.length > 0 ? (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-destructive">Breaking Contract Impact:</span>
              <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                {analysis.breakingDetails.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {analysis.securityWarnings.length > 0 ? (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-yellow-500">Security & Leak Warnings:</span>
              <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                {analysis.securityWarnings.map((warn, idx) => (
                  <li key={idx}>{warn}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {analysis.performanceInsight ? (
            <div className="text-xs text-muted-foreground">
              <strong className="text-foreground">Performance Diagnostic: </strong>
              {analysis.performanceInsight}
            </div>
          ) : null}

          <div className="rounded border border-primary/20 bg-primary/5 p-3 text-xs text-foreground/80">
            <strong className="text-foreground">Why choose Payload {analysis.recommendedPayload}: </strong>
            {analysis.recommendationReason}
          </div>
        </div>
      ) : null}
    </div>
  );
}