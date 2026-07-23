"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, showLineNumbers }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-glass-border bg-surface-secondary">
      {language && (
        <div className="flex items-center justify-between border-b border-glass-border px-4 py-2">
          <span className="text-xs font-medium text-muted">{language}</span>
        </div>
      )}
      <div className="relative overflow-x-auto">
        <button
          onClick={copy}
          className={cn(
            "absolute right-2 top-2 z-10 rounded-lg border px-2.5 py-1.5 text-xs font-medium opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100",
            copied
              ? "border-emerald/30 bg-emerald/10 text-emerald"
              : "border-glass-border bg-surface-elevated/80 text-muted hover:border-glass-border-hover hover:text-primary",
          )}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <pre className="p-4 text-sm leading-relaxed">
          <code className="font-mono text-[13px]">
            {lines.map((line, i) => (
              <span key={i} className="block">
                {showLineNumbers && (
                  <span className="mr-4 inline-block w-8 select-none text-right text-muted/40">
                    {i + 1}
                  </span>
                )}
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
