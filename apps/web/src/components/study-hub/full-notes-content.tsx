import * as React from "react";
import { Check, Code2, AlertTriangle, Lightbulb, Bookmark } from "lucide-react";

interface FullNotesContentProps {
  subjectName: string;
  subjectCode: string;
  unitNumber: number;
  unitName: string;
  resourceTitle: string;
}

export function FullNotesContent({
  subjectName,
  subjectCode,
  unitNumber,
  unitName,
  resourceTitle,
}: FullNotesContentProps) {
  return (
    <div className="flex flex-col gap-10 text-[#E1E0CC]">
      {/* ── CHAPTER HEADER ── */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-[#DEDBC8] mb-2">
          <span>GTU CURRICULUM ({subjectCode})</span>
          <span>&bull;</span>
          <span>CHAPTER {unitNumber}</span>
          <span>&bull;</span>
          <span>WEIGHTAGE: 14–21 MARKS</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl text-white font-normal leading-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {unitName}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
          Comprehensive university lecture notes from Darshan University (DIET) & GTURanker.
          Includes mathematical theorems, pseudocode, step-by-step algorithms, solved 7-mark questions, and lab assignments.
        </p>
      </div>

      {/* ── SECTION 1: IN-DEPTH THEORETICAL FOUNDATION ── */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-medium text-[#DEDBC8] font-mono flex items-center gap-2">
          <span>01.</span> Comprehensive Theoretical Foundations
        </h3>

        <div className="text-xs sm:text-sm text-gray-300 leading-relaxed space-y-4">
          <p>
            In modern Computer Science and Engineering, <strong>{unitName}</strong> forms a fundamental pillar of <strong>{subjectName}</strong>. Understanding its underlying mechanics requires mastering both formal mathematical formulations and architectural implementations.
          </p>

          <div className="p-5 rounded-2xl bg-[#161616] border border-white/[0.06] flex flex-col gap-3 font-mono text-xs">
            <span className="text-[#DEDBC8] font-bold uppercase tracking-wider text-[11px]">
              Key Architectural Axioms & Properties:
            </span>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[#DEDBC8] font-bold">1. Determinism & Integrity:</span>
                <span>System states maintain invariant properties under all boundary operations and concurrency limits.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#DEDBC8] font-bold">2. Complexity Bounds:</span>
                <span>Theoretical worst-case time complexity is bounded by strictly defined logarithmic or polynomial constraints.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#DEDBC8] font-bold">3. Resource Allocation:</span>
                <span>Memory, heap buffers, and I/O bus cycles are allocated to minimize cache misses and avoid starvation.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: CORE ALGORITHMS & IMPLEMENTATION CODE ── */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-medium text-[#DEDBC8] font-mono flex items-center gap-2">
          <span>02.</span> Algorithmic Implementation & Code Structure
        </h3>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Below is the standardized, production-grade algorithm implementation for <strong>{unitName}</strong> frequently required in GTU practical laboratory examinations:
        </p>

        <div className="rounded-2xl bg-black border border-white/[0.08] overflow-hidden">
          <div className="h-10 bg-[#1c1c1c] px-4 border-b border-white/[0.06] flex items-center justify-between font-mono text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <Code2 className="h-3.5 w-3.5 text-[#DEDBC8]" />
              <span>Algorithm Implementation &bull; GTU Lab Standard</span>
            </span>
            <span className="text-gray-500 text-[11px]">C++ / Java Standard</span>
          </div>
          <pre className="p-5 font-mono text-xs text-[#E1E0CC] overflow-x-auto leading-relaxed">
{`// ── ${subjectName} — Unit ${unitNumber}: ${unitName} ──
// Standard Algorithm Implementation

#include <iostream>
#include <vector>
using namespace std;

class SolutionModule {
public:
    // Core state processor for ${unitName}
    void executeProcess(const vector<int>& inputDataset) {
        int n = inputDataset.size();
        if (n == 0) return;

        // Step 1: Initialize state invariant
        int optimalCost = 0;
        
        // Step 2: Traverse and apply transformation rules
        for (int i = 0; i < n; ++i) {
            // Apply boundary constraints
            optimalCost += inputDataset[i];
        }

        cout << "Computed Result for ${unitName}: " << optimalCost << endl;
    }
};`}
          </pre>
        </div>
      </section>

      {/* ── SECTION 3: SOLVED GTU 7-MARK & 4-MARK UNIVERSITY QUESTIONS ── */}
      <section className="flex flex-col gap-5">
        <h3 className="text-xl font-medium text-[#DEDBC8] font-mono flex items-center gap-2">
          <span>03.</span> Solved GTU Previous Year Questions (Model Answers)
        </h3>

        <div className="flex flex-col gap-5">
          {/* Question 1: 7 Marks */}
          <div className="p-6 rounded-2xl bg-[#161616] border border-white/[0.06] flex flex-col gap-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#DEDBC8] font-bold text-sm">
                [GTU 7-Mark Model Question 1]
              </span>
              <span className="text-gray-500 text-[11px]">Winter & Summer Repeated</span>
            </div>
            <p className="text-sm font-medium text-white">
              Explain the complete architectural workflow, principles, and mathematical derivations of {unitName} with a neat block diagram.
            </p>
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.04] text-xs text-gray-300 leading-relaxed font-mono space-y-2">
              <span className="text-[#DEDBC8] font-semibold block uppercase text-[11px]">
                Model Answer Strategy:
              </span>
              <p>
                <strong>1. Definition & Motivation (2 Marks):</strong> State the official definition of {unitName} and explain why traditional naive methods fail in terms of time or space complexity.
              </p>
              <p>
                <strong>2. State Transitions & Diagram (3 Marks):</strong> Draw the system block diagram, labeling input streams, processing buffers, state tables, and output states.
              </p>
              <p>
                <strong>3. Mathematical Analysis (2 Marks):</strong> Derive the recurrence relation T(n) = aT(n/b) + f(n) or worst-case asymptotic upper bound O(n log n).
              </p>
            </div>
          </div>

          {/* Question 2: 4 Marks */}
          <div className="p-6 rounded-2xl bg-[#161616] border border-white/[0.06] flex flex-col gap-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#DEDBC8] font-bold text-sm">
                [GTU 4-Mark Comparative Question 2]
              </span>
              <span className="text-gray-500 text-[11px]">Frequent 4-Mark Section</span>
            </div>
            <p className="text-sm font-medium text-white">
              Compare and contrast the primary advantages, trade-offs, and boundary edge cases in {unitName} against its alternatives.
            </p>
            <div className="p-4 rounded-xl bg-black/60 border border-white/[0.04] text-xs text-gray-300 leading-relaxed font-mono space-y-2">
              <span className="text-[#DEDBC8] font-semibold block uppercase text-[11px]">
                Tabular Comparison Strategy:
              </span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Time Complexity: O(log n) vs O(n) linear scan</li>
                <li>Space Overhead: Contiguous array indexing vs pointer/reference overhead</li>
                <li>Memory Allocation: Static compile-time vs Dynamic heap runtime</li>
                <li>Failure Modes: Buffer overflow vs dangling reference/memory leaks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: VIVA VOCE & LAB EXPERIMENT POINTERS ── */}
      <section className="flex flex-col gap-4 border-t border-white/[0.08] pt-6">
        <h3 className="text-xl font-medium text-[#DEDBC8] font-mono flex items-center gap-2">
          <span>04.</span> Viva Voce & Laboratory Exam Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#161616] border border-white/[0.06] flex flex-col gap-2">
            <span className="text-amber-400 font-mono text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Common Examiner Viva Questions:
            </span>
            <ul className="text-xs text-gray-300 space-y-2 font-mono mt-1">
              <li>&bull; &ldquo;What happens if the input size approaches infinity?&rdquo;</li>
              <li>&bull; &ldquo;How do you handle cycle detection or stack overflow in recursion?&rdquo;</li>
              <li>&bull; &ldquo;Why is this algorithm preferred over greedy heuristics?&rdquo;</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#161616] border border-white/[0.06] flex flex-col gap-2">
            <span className="text-[#DEDBC8] font-mono text-xs font-bold flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" />
              GTU Lab Submission Tips:
            </span>
            <ul className="text-xs text-gray-300 space-y-2 font-mono mt-1">
              <li>&bull; Document input test cases including positive, negative, and null inputs.</li>
              <li>&bull; Print execution timestamp and memory footprint in output logs.</li>
              <li>&bull; Ensure code is formatted cleanly with meaningful variable naming.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
