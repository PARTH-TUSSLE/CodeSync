"use client";

import { useEffect, useState } from "react";

interface ReadmeRendererProps {
  content: string;
}

export function ReadmeRenderer({ content }: ReadmeRendererProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    async function render() {
      try {
        const { markdown } = await import("../../lib/markdown");
        const rendered = await markdown(content);
        setHtml(rendered);
      } catch {
        setHtml(`<pre class="text-xs text-muted p-4">${escapeHtml(content)}</pre>`);
      }
    }
    render();
  }, [content]);

  return (
    <div className="border-t border-glass-border">
      <div className="px-4 py-3 text-xs font-medium text-muted border-b border-glass-border">
        README.md
      </div>
      <div
        className="markdown-body px-4 py-4 text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
