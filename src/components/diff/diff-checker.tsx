// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { DiffTreeView } from "@/components/diff/diff-tree-view";
// import { DiffSummary } from "@/components/diff/diff-summary";
// import { AiDiffCard } from "@/components/diff/ai-diff-card";
// import { safeDiffResponses, flattenChanges } from "@/lib/diff";
// import type { DiffNode } from "@/lib/diff";
// import type { AIDiffAnalysis } from "@/types/ai-diff";

// const PLACEHOLDER_A = '{\n  "id": 1,\n  "name": "Alice"\n}';
// const PLACEHOLDER_B = '{\n  "id": 1,\n  "name": "Alicia"\n}';

// const TEXTAREA_CLASSES =
//   "h-64 w-full rounded-md border border-input bg-transparent p-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// export function DiffChecker() {
//   const [left, setLeft] = useState("");
//   const [right, setRight] = useState("");
//   const [durationA, setDurationA] = useState<string>("");
//   const [durationB, setDurationB] = useState<string>("");

//   const [result, setResult] = useState<DiffNode | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const [aiAnalysis, setAiAnalysis] = useState<AIDiffAnalysis | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const handleCompare = () => {
//     const outcome = safeDiffResponses(left, right);
//     if ("error" in outcome) {
//       setError(outcome.error);
//       setResult(null);
//       setAiAnalysis(null);
//       return;
//     }
//     setError(null);
//     setResult(outcome.diff);
//     setAiAnalysis(null); // Reset analysis when inputs change
//   };

//   const handleRunAiAnalysis = async () => {
//     if (!result) return;
//     setIsAnalyzing(true);

//     try {
//       const flat = flattenChanges(result);
//       const parsedDurationA = durationA.trim() ? Number(durationA) : undefined;
//       const parsedDurationB = durationB.trim() ? Number(durationB) : undefined;

//       const res = await fetch("/api/ai/analyze-diff", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           changes: flat.map((change) => ({
//             path: change.path,
//             status: change.status,
//             leftValue: change.leftValue,
//             rightValue: change.rightValue
//           })),
//           durationA: Number.isFinite(parsedDurationA) ? parsedDurationA : undefined,
//           durationB: Number.isFinite(parsedDurationB) ? parsedDurationB : undefined
//         })
//       });

//       if (!res.ok) {
//         throw new Error("Failed to generate AI contract analysis");
//       }

//       const data: AIDiffAnalysis = await res.json();
//       setAiAnalysis(data);
//     } catch {
//       setAiAnalysis(null);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <div className="space-y-4 p-6">
//       <div className="grid gap-4 md:grid-cols-2">
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <label className="text-sm font-medium" htmlFor="diff-left">
//               Response A
//             </label>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="duration-a" className="text-xs text-muted-foreground">
//                 Latency (ms):
//               </Label>
//               <Input
//                 id="duration-a"
//                 type="number"
//                 value={durationA}
//                 onChange={(event) => setDurationA(event.target.value)}
//                 placeholder="e.g. 120"
//                 className="h-7 w-24 font-mono text-xs"
//               />
//             </div>
//           </div>
//           <textarea
//             id="diff-left"
//             value={left}
//             onChange={(event) => setLeft(event.target.value)}
//             placeholder={PLACEHOLDER_A}
//             spellCheck={false}
//             className={TEXTAREA_CLASSES}
//           />
//         </div>

//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <label className="text-sm font-medium" htmlFor="diff-right">
//               Response B
//             </label>
//             <div className="flex items-center gap-2">
//               <Label htmlFor="duration-b" className="text-xs text-muted-foreground">
//                 Latency (ms):
//               </Label>
//               <Input
//                 id="duration-b"
//                 type="number"
//                 value={durationB}
//                 onChange={(event) => setDurationB(event.target.value)}
//                 placeholder="e.g. 350"
//                 className="h-7 w-24 font-mono text-xs"
//               />
//             </div>
//           </div>
//           <textarea
//             id="diff-right"
//             value={right}
//             onChange={(event) => setRight(event.target.value)}
//             placeholder={PLACEHOLDER_B}
//             spellCheck={false}
//             className={TEXTAREA_CLASSES}
//           />
//         </div>
//       </div>

//       <Button type="button" onClick={handleCompare}>
//         Compare
//       </Button>

//       {error ? (
//         <div
//           role="alert"
//           className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
//         >
//           {error}
//         </div>
//       ) : null}

//       {result ? (
//         <div className="space-y-4">
//           <AiDiffCard
//             analysis={aiAnalysis}
//             isAnalyzing={isAnalyzing}
//             onAnalyze={handleRunAiAnalysis}
//             disabled={!result}
//           />

//           <div className="space-y-3 rounded-md border border-border bg-card p-4">
//             <DiffSummary node={result} />
//             <div className="overflow-auto rounded-md border border-border bg-background p-3">
//               <DiffTreeView node={result} />
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {!result && !error ? (
//         <div className="rounded-md border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
//           Paste two JSON responses above and click Compare to inspect structural
//           changes and trigger AI semantic contract analysis.
//         </div>
//       ) : null}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DiffTreeView } from "@/components/diff/diff-tree-view";
import { DiffSummary } from "@/components/diff/diff-summary";
import { AiDiffCard } from "@/components/diff/ai-diff-card";
import { safeDiffResponses, flattenChanges } from "@/lib/diff";
import type { DiffNode } from "@/lib/diff";
import type { AIDiffAnalysis } from "@/types/ai-diff";
import { Copy, Check } from "lucide-react";

const PLACEHOLDER_A = '{\n  "id": 1,\n  "name": "Alice"\n}';
const PLACEHOLDER_B = '{\n  "id": 1,\n  "name": "Alicia"\n}';

const TEXTAREA_CLASSES =
  "h-64 w-full rounded-md border border-input bg-transparent p-3 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function DiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [durationA, setDurationA] = useState<string>("");
  const [durationB, setDurationB] = useState<string>("");

  const [result, setResult] = useState<DiffNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [aiAnalysis, setAiAnalysis] = useState<AIDiffAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasNewChangesToAnalyze, setHasNewChangesToAnalyze] = useState(false);

  const [copiedSide, setCopiedSide] = useState<"A" | "B" | null>(null);

  const handleCopy = async (text: string, side: "A" | "B") => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedSide(side);
    setTimeout(() => setCopiedSide(null), 1500);
  };

  const handleCompare = () => {
    const outcome = safeDiffResponses(left, right);
    if ("error" in outcome) {
      setError(outcome.error);
      setResult(null);
      setAiAnalysis(null);
      setHasNewChangesToAnalyze(false);
      return;
    }
    setError(null);
    setResult(outcome.diff);
    setAiAnalysis(null);

    // Only allow AI run if there are actual detected differences
    const changesCount = flattenChanges(outcome.diff).length;
    setHasNewChangesToAnalyze(changesCount > 0);
  };

  const handleRunAiAnalysis = async () => {
    if (!result || !hasNewChangesToAnalyze) return;
    setIsAnalyzing(true);

    try {
      const flat = flattenChanges(result);
      const parsedDurationA = durationA.trim() ? Number(durationA) : undefined;
      const parsedDurationB = durationB.trim() ? Number(durationB) : undefined;

      const res = await fetch("/api/ai/analyze-diff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          changes: flat.map((change) => ({
            path: change.path,
            status: change.status,
            leftValue: change.leftValue,
            rightValue: change.rightValue,
          })),
          durationA: Number.isFinite(parsedDurationA)
            ? parsedDurationA
            : undefined,
          durationB: Number.isFinite(parsedDurationB)
            ? parsedDurationB
            : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate AI contract analysis");
      }

      const data: AIDiffAnalysis = await res.json();
      setAiAnalysis(data);
      // Disable the button since the current result is already analyzed
      setHasNewChangesToAnalyze(false);
    } catch {
      setAiAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLeftChange = (val: string) => {
    setLeft(val);
    setHasNewChangesToAnalyze(false);
  };

  const handleRightChange = (val: string) => {
    setRight(val);
    setHasNewChangesToAnalyze(false);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Side: Response A */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium" htmlFor="diff-left">
                Response A
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handleCopy(left, "A")}
                disabled={!left}
                title="Copy Response A"
              >
                {copiedSide === "A" ? (
                  <>
                    <Check className="mr-1 h-3 w-3 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="duration-a"
                className="text-xs text-muted-foreground whitespace-nowrap"
              >
                Latency (ms):
              </Label>
              <Input
                id="duration-a"
                type="number"
                value={durationA}
                onChange={(e) => {
                  setDurationA(e.target.value);
                  if (result) setHasNewChangesToAnalyze(true);
                }}
                placeholder="e.g. 120"
                className="h-8 w-28 font-mono text-xs pl-3 pr-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
              />
            </div>
          </div>
          <textarea
            id="diff-left"
            value={left}
            onChange={(e) => handleLeftChange(e.target.value)}
            placeholder={PLACEHOLDER_A}
            spellCheck={false}
            className={TEXTAREA_CLASSES}
          />
        </div>

        {/* Right Side: Response B */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium" htmlFor="diff-right">
                Response B
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handleCopy(right, "B")}
                disabled={!right}
                title="Copy Response B"
              >
                {copiedSide === "B" ? (
                  <>
                    <Check className="mr-1 h-3 w-3 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="duration-b"
                className="text-xs text-muted-foreground whitespace-nowrap"
              >
                Latency (ms):
              </Label>
              <Input
                id="duration-b"
                type="number"
                value={durationB}
                onChange={(e) => {
                  setDurationB(e.target.value);
                  if (result) setHasNewChangesToAnalyze(true);
                }}
                placeholder="e.g. 350"
                className="h-8 w-28 font-mono text-xs pl-3 pr-2 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
              />
            </div>
          </div>
          <textarea
            id="diff-right"
            value={right}
            onChange={(e) => handleRightChange(e.target.value)}
            placeholder={PLACEHOLDER_B}
            spellCheck={false}
            className={TEXTAREA_CLASSES}
          />
        </div>
      </div>

      <Button type="button" onClick={handleCompare}>
        Compare
      </Button>

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-4">
          <AiDiffCard
            analysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleRunAiAnalysis}
            disabled={!hasNewChangesToAnalyze}
          />

          <div className="space-y-3 rounded-md border border-border bg-card p-4">
            <DiffSummary node={result} />
            <div className="overflow-auto rounded-md border border-border bg-background p-3">
              <DiffTreeView node={result} />
            </div>
          </div>
        </div>
      ) : null}

      {!result && !error ? (
        <div className="rounded-md border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
          Paste two JSON responses above and click Compare to inspect structural
          changes and trigger AI semantic contract analysis.
        </div>
      ) : null}
    </div>
  );
}
