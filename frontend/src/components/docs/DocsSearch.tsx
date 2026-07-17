"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { docNavItems } from "@/lib/docs-nav";
import { cn } from "@/lib/cn";

function flattenNav(items: typeof docNavItems): { title: string; href: string }[] {
  const result: { title: string; href: string }[] = [];
  for (const item of items) {
    result.push({ title: item.title, href: item.href });
    if (item.children) {
      result.push(...item.children.map((c) => ({ title: c.title, href: c.href })));
    }
  }
  return result;
}

const allDocs = flattenNav(docNavItems);

export function DocsSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim()
    ? allDocs.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex].href);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="flex w-full items-center gap-2 rounded-lg border border-glass-border bg-surface-secondary/50 px-3 py-2 text-sm text-muted transition-colors hover:border-glass-border-hover hover:text-primary"
      >
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden rounded-md border border-glass-border bg-surface-tertiary px-1.5 py-0.5 text-[11px] font-medium text-muted/60 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
          />
          <div className="fixed left-1/2 top-[15%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-glass-border bg-surface-elevated shadow-2xl">
            <div className="flex items-center gap-2 border-b border-glass-border px-4">
              <svg className="size-4 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search documentation..."
                className="flex-1 bg-transparent py-3.5 text-sm text-primary outline-none placeholder:text-muted/50"
                autoFocus
              />
              <button
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="rounded-md px-2 py-1 text-xs text-muted transition-colors hover:text-primary"
              >
                Esc
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {query.trim() && results.length === 0 && (
                <p className="p-4 text-center text-sm text-muted">
                  No results found for &ldquo;{query}&rdquo;
                </p>
              )}
              {results.map((item, i) => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    i === selectedIndex
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:bg-glass-hover hover:text-primary",
                  )}
                >
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
