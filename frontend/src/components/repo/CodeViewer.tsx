"use client";

import { useEffect, useState } from "react";
import type { FileContent } from "@/types/models";

interface CodeViewerProps {
  file: FileContent;
  editHref?: string;
}

async function highlight(code: string, lang: string | null): Promise<string> {
  try {
    const shiki = await import("shiki");
    const highlighter = await shiki.createHighlighter({
      langs: lang ? [lang as any] : ["text"],
      themes: ["github-dark", "github-light"],
    });
    return highlighter.codeToHtml(code, {
      lang: lang || "text",
      theme: "github-dark",
    });
  } catch {
    return `<pre class="p-4 text-xs leading-relaxed overflow-x-auto"><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function CodeViewer({ file, editHref }: CodeViewerProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    highlight(file.content, file.language).then(setHtml);
  }, [file.content, file.language]);

  return (
    <div className="overflow-hidden rounded-lg border border-glass-border">
      <div className="flex items-center justify-between border-b border-glass-border bg-surface-elevated px-4 py-2">
        <div className="flex items-center gap-2">
          <svg className="size-4 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-xs font-medium text-primary">{file.filename}</span>
        </div>
        <div className="flex items-center gap-2">
          {file.language && (
            <span className="rounded bg-glass px-2 py-0.5 text-[10px] text-subtle uppercase">
              {file.language}
            </span>
          )}
          <span className="text-[10px] text-subtle">
            {file.size > 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${file.size} B`}
          </span>
          {editHref && (
            <a
              href={editHref}
              className="ml-2 rounded border border-glass-border px-2 py-0.5 text-[10px] text-muted hover:text-primary transition-colors"
            >
              Edit
            </a>
          )}
        </div>
      </div>
      <div
        className="overflow-x-auto bg-[#0d1117]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
