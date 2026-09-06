import { NextResponse } from "next/server";
import { z } from "zod";
import type { AIDiffAnalysis } from "@/types/ai-diff";

const requestSchema = z.object({
  changes: z.array(
    z.object({
      path: z.string(),
      status: z.enum(["added", "removed", "changed"]),
      leftValue: z.unknown().optional(),
      rightValue: z.unknown().optional()
    })
  ),
  durationA: z.number().optional(),
  durationB: z.number().optional()
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid diff payload" }, { status: 400 });
    }

    const { changes, durationA, durationB } = parsed.data;

    // Zero-token guardrail: identical payloads require no AI call
    if (changes.length === 0) {
      const fallback: AIDiffAnalysis = {
        summary: "Payloads are structurally and semantically identical.",
        riskLevel: "NONE",
        isBreakingChange: false,
        breakingDetails: [],
        securityWarnings: [],
        performanceInsight:
          durationA && durationB
            ? `Latency shifted by ${durationB - durationA}ms with zero schema drift.`
            : null,
        recommendedPayload: "A",
        recommendationReason: "Both payloads match the same contract."
      };
      return NextResponse.json(fallback);
    }

    const latencyText =
      durationA !== undefined && durationB !== undefined
        ? `Payload A Latency: ${durationA}ms | Payload B Latency: ${durationB}ms (Delta: ${durationB - durationA}ms)`
        : "Latency metrics omitted.";

    const prompt = `
You are a Principal API Reliability Architect & Semantic Contract Validator.
Evaluate this structural API difference between Payload A (Existing/Staging) and Payload B (Candidate/Production).

PERFORMANCE TELEMETRY:
${latencyText}

STRUCTURAL DELTA (Flattened AST):
${JSON.stringify(changes.slice(0, 50), null, 2)}

Provide an authoritative engineering review. Return ONLY a valid JSON object matching this schema:
{
  "summary": "1-2 sentence executive summary of what changed.",
  "riskLevel": "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "isBreakingChange": boolean,
  "breakingDetails": ["reasons why client SDKs, mobile apps, or downstream consumers will crash"],
  "securityWarnings": ["any exposed PII, passwords, JWTs, or internal metadata keys"],
  "performanceInsight": "explanation of the latency delta relative to schema or data weight, or null",
  "recommendedPayload": "A" | "B" | "NEITHER",
  "recommendationReason": "Actionable verdict on which response payload the team should adopt and why."
}
`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        response_format: { type: "json_object" },
        reasoning_format: "hidden",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      return NextResponse.json(
        { error: `LLM service error: ${errText}` },
        { status: 502 }
      );
    }

    const aiData = await aiRes.json();
    const result: AIDiffAnalysis = JSON.parse(aiData.choices[0].message.content);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}