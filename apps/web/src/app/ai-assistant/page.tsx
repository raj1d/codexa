"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typewriter } from "@/components/ui/typewriter";
import {
  Sparkles,
  Send,
  BookOpen,
  ExternalLink,
  Zap,
  GraduationCap,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface Citation {
  document_id: string;
  document_title: string;
  unit_number: number;
  subject_name: string;
  quote: string;
  relevance_score: number;
}

interface Message {
  id: string;
  type: "user" | "ai";
  question?: string;
  content: string;
  citations?: Citation[];
  mode?: string;
  keyTakeaways?: string[];
  isStreaming?: boolean;
}

function AiAssistantContent() {
  const searchParams = useSearchParams();
  const initialDocId = searchParams?.get("doc");
  const initialHintSlug = searchParams?.get("hint");

  const [inputQuestion, setInputQuestion] = React.useState("");
  const [isBeginner, setIsBeginner] = React.useState(false);
  const [isVivaMode, setIsVivaMode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<"chat" | "summarize">("chat");
  const [summarizeText, setSummarizeText] = React.useState("");
  const [summaryResult, setSummaryResult] = React.useState<any>(null);

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content:
        "Hello! I am your CODEXA AI Study Assistant. I answer your questions grounded directly in verified GTU syllabus notes, with exact source citations.",
      mode: "Syllabus Grounded",
      keyTakeaways: [
        "Ask about DBMS normalization, Operating Systems paging, DSA trees, or Networks",
        "Toggle Beginner Mode for simple real-world analogies",
        "Toggle Viva Mode for rapid university exam answers",
      ],
    },
  ]);

  const handleAsk = React.useCallback(
    async (questionText?: string) => {
      const q = questionText || inputQuestion;
      if (!q.trim() || loading) return;

      const userMessage: Message = {
        id: String(Date.now()),
        type: "user",
        content: q,
      };

      setMessages((prev) => [...prev, userMessage]);
      if (!questionText) setInputQuestion("");
      setLoading(true);

      try {
        const res = await fetch(`${API_URL}/ai/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            docId: initialDocId || undefined,
            isBeginner,
            isVivaMode,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const aiMessage: Message = {
            id: String(Date.now() + 1),
            type: "ai",
            question: data.question,
            content: data.answer,
            citations: data.citations,
            mode: data.mode,
            keyTakeaways: data.key_takeaways,
            isStreaming: true,
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } catch (err) {
        console.error("AI query failed:", err);
      } finally {
        setLoading(false);
      }
    },
    [inputQuestion, loading, initialDocId, isBeginner, isVivaMode],
  );

  React.useEffect(() => {
    async function loadSuggestions() {
      try {
        const res = await fetch(`${API_URL}/ai/suggestions`);
        if (res.ok) {
          const data = await res.json();
          setSuggestedQuestions(data);
        }
      } catch (err) {
        console.error("Failed to load suggestions:", err);
      }
    }
    loadSuggestions();

    if (initialHintSlug) {
      handleAsk(
        `What is the optimal algorithmic approach and time complexity for solving '${initialHintSlug}'?`,
      );
    }
  }, [initialHintSlug, handleAsk]);

  const handleSummarize = async () => {
    if (!summarizeText.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: summarizeText,
          title: "Custom Study Material",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSummaryResult(data);
      }
    } catch (err) {
      console.error("Summarize failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8 py-2 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <span className="text-[#DEDBC8] text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">
              RAG Grounded Intelligence
            </span>
            <h1
              className="text-3xl sm:text-4xl text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              AI Study Assistant
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Ask syllabus questions with direct citations to verified lecture notes.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#101010] rounded-full border border-white/[0.08]">
            <button
              onClick={() => setActiveTab("chat")}
              className={`h-8 px-4 rounded-full font-mono text-xs transition-colors cursor-pointer ${
                activeTab === "chat"
                  ? "bg-[#DEDBC8] text-black font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Q&A Chat
            </button>
            <button
              onClick={() => setActiveTab("summarize")}
              className={`h-8 px-4 rounded-full font-mono text-xs transition-colors cursor-pointer ${
                activeTab === "summarize"
                  ? "bg-[#DEDBC8] text-black font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Summarize Notes
            </button>
          </div>
        </div>

        {activeTab === "chat" ? (
          <>
            {/* Control Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setIsBeginner(!isBeginner);
                  if (!isBeginner) setIsVivaMode(false);
                }}
                className={`h-9 px-4 rounded-full font-mono text-xs flex items-center gap-2 border transition-all cursor-pointer select-none ${
                  isBeginner
                    ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-semibold"
                    : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] bg-[#101010]"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Explain Like I&apos;m a Beginner</span>
              </button>

              <button
                onClick={() => {
                  setIsVivaMode(!isVivaMode);
                  if (!isVivaMode) setIsBeginner(false);
                }}
                className={`h-9 px-4 rounded-full font-mono text-xs flex items-center gap-2 border transition-all cursor-pointer select-none ${
                  isVivaMode
                    ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-semibold"
                    : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] bg-[#101010]"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Viva / 7-Mark Exam Mode</span>
              </button>
            </div>

            {/* Suggested Questions */}
            {suggestedQuestions.length > 0 && messages.length <= 1 && (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider">
                  Suggested Exam Questions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => handleAsk(sq)}
                      className="text-left text-xs font-mono px-3.5 py-2 rounded-xl bg-[#101010] border border-white/[0.06] text-gray-300 hover:text-white hover:border-white/[0.16] transition-colors cursor-pointer"
                    >
                      &gt; {sq}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex flex-col gap-6">
              {messages.map((msg) => {
                if (msg.type === "user") {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-xl p-4 sm:p-5 rounded-2xl bg-[#212121] border border-white/[0.08] text-[#E1E0CC] text-xs sm:text-sm font-normal shadow-lg">
                        <span className="text-[10px] font-mono text-[#DEDBC8] block mb-1">
                          You asked:
                        </span>
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <Card
                    key={msg.id}
                    className="p-7 sm:p-8 flex flex-col gap-5 border border-white/[0.08] shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#DEDBC8]" />
                        <span className="text-xs font-mono text-[#DEDBC8] uppercase tracking-wider font-semibold">
                          {msg.mode || "Grounded Syllabus Intelligence"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">
                        GTU CSE/IT
                      </span>
                    </div>

                    <div className="text-gray-300 text-xs sm:text-sm leading-[1.8] whitespace-pre-line font-normal">
                      {msg.isStreaming ? (
                        <Typewriter text={msg.content} speed={20} />
                      ) : (
                        msg.content
                      )}
                    </div>

                    {msg.keyTakeaways && msg.keyTakeaways.length > 0 && (
                      <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] flex flex-col gap-2 font-mono text-xs text-gray-400">
                        <span className="text-[#DEDBC8] font-medium text-[11px] uppercase tracking-wider">
                          Key Exam Takeaways:
                        </span>
                        {msg.keyTakeaways.map((k, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-[#DEDBC8]">&bull;</span>
                            <span>{k}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-2">
                        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                          Grounded Source Citations:
                        </span>
                        <div className="flex flex-col gap-2">
                          {msg.citations.map((c, cIdx) => (
                            <Link
                              key={cIdx}
                              href={`/study-hub/resource/${c.document_id}`}
                              className="p-3 rounded-xl bg-black/40 border border-white/[0.06] hover:border-white/[0.16] transition-colors flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-2.5">
                                <BookOpen className="h-3.5 w-3.5 text-[#DEDBC8] shrink-0" />
                                <div className="text-xs font-mono">
                                  <span className="text-white group-hover:underline">
                                    {c.document_title}
                                  </span>
                                  <span className="text-gray-500 block text-[11px] mt-0.5">
                                    {c.subject_name} &bull; Unit {c.unit_number} (relevance:{" "}
                                    {Math.round(c.relevance_score * 100)}%)
                                  </span>
                                </div>
                              </div>
                              <ExternalLink className="h-3.5 w-3.5 text-gray-500 group-hover:text-white transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}

              {loading && (
                <div className="p-6 rounded-2xl bg-[#101010] border border-white/[0.08] font-mono text-xs text-gray-400 flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-[#DEDBC8] border-t-transparent rounded-full animate-spin" />
                  <span>
                    Retrieving grounded syllabus chunks and synthesizing answer...
                  </span>
                </div>
              )}
            </div>

            {/* Sticky Input Bar */}
            <div className="sticky bottom-6 z-20 pt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder={
                    isBeginner
                      ? "Ask in simple terms (e.g. explain deadlocks like I'm 5)..."
                      : isVivaMode
                        ? "Ask a university exam/viva question (e.g. explain BCNF vs 3NF)..."
                        : "Ask any GTU syllabus question (DBMS, OS, DSA, Networks)..."
                  }
                  className="w-full h-14 pl-5 pr-14 rounded-full bg-[#101010]/95 backdrop-blur-md border border-white/[0.12] text-[#E1E0CC] font-mono text-xs sm:text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#DEDBC8] shadow-2xl transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !inputQuestion.trim()}
                  className="absolute right-2 h-10 w-10 rounded-full bg-[#DEDBC8] text-black flex items-center justify-center hover:bg-white transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  title="Send Question"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-6">
            <Card className="p-7 sm:p-8 flex flex-col gap-4">
              <h3 className="text-xl font-medium text-white">
                Summarize Notes & Generate Viva Questions
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Paste raw lecture notes, chapter excerpts, or textbook paragraphs below. The AI will extract core takeaways and predict 7-mark university exam questions.
              </p>

              <textarea
                rows={6}
                value={summarizeText}
                onChange={(e) => setSummarizeText(e.target.value)}
                placeholder="Paste notes text here (e.g. Paging in Operating Systems is a memory management scheme...)..."
                className="p-4 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors resize-none"
              />

              <Button
                variant="default"
                size="lg"
                disabled={loading || !summarizeText.trim()}
                onClick={handleSummarize}
                className="w-full mt-2"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Analyzing Content..." : "Generate Summary & Exam Quiz"}
              </Button>
            </Card>

            {summaryResult && (
              <Card className="p-7 sm:p-8 flex flex-col gap-6 border border-[#DEDBC8]/30">
                <div>
                  <span className="text-[10px] font-mono text-[#DEDBC8] uppercase tracking-wider block mb-1">
                    AI Analysis Result
                  </span>
                  <h3 className="text-2xl font-medium text-white">
                    {summaryResult.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed font-normal">
                  {summaryResult.summary}
                </p>

                <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] flex flex-col gap-2 font-mono text-xs">
                  <span className="text-[#DEDBC8] font-medium uppercase tracking-wider text-[11px]">
                    Key Takeaways:
                  </span>
                  {summaryResult.key_points.map((pt: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-[#DEDBC8]">&bull;</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-white/[0.06] flex flex-col gap-2 font-mono text-xs">
                  <span className="text-amber-400 font-medium uppercase tracking-wider text-[11px]">
                    Predicted University Exam Questions:
                  </span>
                  {summaryResult.potential_exam_questions.map((q: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-amber-400">{i + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function AiAssistantPage() {
  return (
    <React.Suspense
      fallback={
        <AppShell>
          <div className="py-12 text-center text-gray-500 font-mono text-xs">
            Loading AI Assistant...
          </div>
        </AppShell>
      }
    >
      <AiAssistantContent />
    </React.Suspense>
  );
}
