"use client";

import * as React from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Play, RotateCcw, Check, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
  onRun: () => void;
  onReset?: () => void;
  isRunning?: boolean;
}

export function CodeEditor({
  language,
  code,
  onChange,
  onRun,
  onReset,
  isRunning = false,
}: CodeEditorProps) {
  const handleEditorWillMount = (monaco: Monaco) => {
    // Custom Dark Terminal Theme (DESIGN.md §2, §5)
    monaco.editor.defineTheme("codexa-terminal", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "4ADE80", fontStyle: "bold" },
        { token: "string", foreground: "5EEAD4" },
        { token: "number", foreground: "FBBF24" },
        { token: "comment", foreground: "565B68", fontStyle: "italic" },
        { token: "type", foreground: "5EEAD4" },
        { token: "function", foreground: "E8E9ED" },
        { token: "identifier", foreground: "E8E9ED" },
      ],
      colors: {
        "editor.background": "#0A0B0F",
        "editor.foreground": "#E8E9ED",
        "editorCursor.foreground": "#4ADE80",
        "editor.lineHighlightBackground": "#131620",
        "editorLineNumber.foreground": "#565B68",
        "editorLineNumber.activeForeground": "#4ADE80",
        "editor.selectionBackground": "#1B1F2C",
        "editorIndentGuide.background": "#1B1F2C",
        "editorIndentGuide.activeBackground": "#4ADE80",
      },
    });
  };

  return (
    <div className="flex flex-col h-full rounded-lg bg-bg-surface border border-[rgba(255,255,255,0.08)] overflow-hidden scanlines">
      {/* Editor Header / Controls */}
      <div className="h-11 bg-bg-surface-raised px-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between font-mono text-xs select-none">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-accent-phosphor" />
          <span className="text-text-primary font-medium">{language.toUpperCase()} Sandbox</span>
          <span className="text-text-dim">&bull;</span>
          <span className="text-text-dim text-[11px]">UTF-8</span>
        </div>

        <div className="flex items-center gap-2">
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 text-xs font-mono text-text-dim hover:text-text-primary"
              title="Reset to starter code"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}

          <Button
            variant="default"
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="h-7 text-xs px-4"
          >
            <Play className={`h-3 w-3 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Running Tests..." : "Run & Test Code"}
          </Button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-[380px] relative">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language === "python" ? "python" : "javascript"}
          value={code}
          theme="codexa-terminal"
          beforeMount={handleEditorWillMount}
          onChange={onChange}
          options={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 13,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            padding: { top: 12, bottom: 12 },
            lineNumbersMinChars: 3,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
