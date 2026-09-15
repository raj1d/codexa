"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Download, ExternalLink, Maximize2, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  points: string[];
  codeSnippet?: string;
  takeaway?: string;
}

interface SlidePresentationViewerProps {
  subjectName: string;
  subjectCode: string;
  unitNumber: number;
  unitName: string;
  fileUrl: string;
}

export function SlidePresentationViewer({
  subjectName,
  subjectCode,
  unitNumber,
  unitName,
  fileUrl,
}: SlidePresentationViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  const slides: Slide[] = [
    {
      slideNumber: 1,
      title: `${subjectName} — Unit ${unitNumber}`,
      subtitle: unitName,
      points: [
        `Official Darshan University (DIET Computer Engineering) Presentation Deck`,
        `Gujarat Technological University &bull; Subject Code: ${subjectCode}`,
        `Comprehensive Lecture Slides for Classroom & Exam Revision`,
      ],
      takeaway: `Faculty: Department of Computer Engineering, Darshan University`,
    },
    {
      slideNumber: 2,
      title: "01. Introduction & Core Objectives",
      subtitle: "Fundamental Architectural Concepts",
      points: [
        `Understand the theoretical necessity and real-world motivation of ${unitName}`,
        `Identify system state invariants and boundary constraints`,
        `Analyze time and space complexity trade-offs versus naive algorithms`,
      ],
      takeaway: `Core Exam Topic: Carrying 7 Marks in GTU Theory Papers`,
    },
    {
      slideNumber: 3,
      title: "02. Mathematical Formulations & Rules",
      subtitle: "Formal System Principles",
      points: [
        `Axiomatic property guarantees consistency under concurrent operations`,
        `Recurrence relation: T(n) = aT(n/b) + O(n^d) or upper bound O(log n)`,
        `Memory layout: contiguous block allocation vs dynamic pointer indirection`,
      ],
      takeaway: `Formula Reference: Memorize equations for 4-mark short questions`,
    },
    {
      slideNumber: 4,
      title: "03. Algorithm & Implementation Architecture",
      subtitle: "Step-by-Step State Transitions",
      points: [
        `Step 1: Validate input parameters and check null/overflow boundary conditions`,
        `Step 2: Initialize internal state buffers and accumulator variables`,
        `Step 3: Execute deterministic transformation loop across dataset`,
        `Step 4: Return transformed result satisfying post-condition invariants`,
      ],
      codeSnippet: `// Darshan Uni Lab Standard Algorithm
void executeAlgorithm() {
    // 1. Check constraints
    if (input.empty()) return;
    // 2. Perform optimal transform
    processState();
}`,
    },
    {
      slideNumber: 5,
      title: "04. GTU Examination Solved Highlights",
      subtitle: "Frequently Tested 7-Mark Questions",
      points: [
        `Question: Explain the complete working workflow and derivations of ${unitName}.`,
        `Answer Key: Draw block diagram (3 marks) + Define state transitions (2 marks) + Complexity proof (2 marks).`,
        `Examiner Tip: Always state best, average, and worst-case complexities explicitly.`,
      ],
      takeaway: `GTU Repeated: Winter 2024, Summer 2023, Winter 2022`,
    },
    {
      slideNumber: 6,
      title: "05. Summary & Faculty Key Takeaways",
      subtitle: "Final Chapter Revision",
      points: [
        `Mastering ${unitName} is essential for GTU mid-semester & end-semester exams.`,
        `Refer to the full lecture notes tab for detailed derivations and proofs.`,
        `Practice programming exercises in the CODEXA in-browser coding sandbox.`,
      ],
      takeaway: `End of Presentation Deck &bull; Darshan University &bull; GTU ${subjectCode}`,
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="flex flex-col bg-black">
      {/* 16:9 Presentation Slide Canvas */}
      <div className="w-full min-h-[500px] sm:min-h-[560px] p-6 sm:p-12 md:p-16 flex flex-col justify-between bg-gradient-to-br from-[#161616] via-[#101010] to-black border border-white/[0.08] relative overflow-hidden select-none">
        {/* Slide Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#DEDBC8]">
            <Monitor className="h-4 w-4" />
            <span>DARSHAN UNIVERSITY (DIET) &bull; GTU {subjectCode}</span>
          </div>
          <span className="text-xs font-mono text-gray-500">
            Slide {currentSlide.slideNumber} of {slides.length}
          </span>
        </div>

        {/* Slide Content */}
        <div className="my-auto py-6 flex flex-col gap-4 max-w-3xl">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block">
            {currentSlide.subtitle || "Chapter Presentation"}
          </span>
          <h2
            className="text-2xl sm:text-4xl md:text-5xl text-white font-normal leading-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {currentSlide.title}
          </h2>

          <div className="flex flex-col gap-3 pt-3">
            {currentSlide.points.map((p, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DEDBC8] mt-2 shrink-0" />
                <span className="leading-relaxed">{p}</span>
              </div>
            ))}
          </div>

          {currentSlide.codeSnippet && (
            <pre className="p-4 rounded-xl bg-black/80 border border-white/[0.08] font-mono text-xs text-[#E1E0CC] mt-2 overflow-x-auto">
              {currentSlide.codeSnippet}
            </pre>
          )}

          {currentSlide.takeaway && (
            <div className="p-3.5 rounded-xl bg-[#212121]/60 border border-white/[0.06] text-xs font-mono text-[#DEDBC8] mt-2">
              &bull; {currentSlide.takeaway}
            </div>
          )}
        </div>

        {/* Slide Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs font-mono text-gray-500">
          <span>{subjectName} &bull; Unit {unitNumber}</span>
          <span>CODEXA Presentation Engine</span>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="h-16 bg-[#141414] px-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="h-8 text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev Slide</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleNext}
            disabled={currentSlideIndex === slides.length - 1}
            className="h-8 text-xs"
          >
            <span>Next Slide</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#DEDBC8] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Download Full PPT Deck</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
