"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import type { TOCItem } from "@/lib/docs-nav";

interface DocsTOCProps {
  items: TOCItem[];
}

export function DocsTOC({ items }: DocsTOCProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0.1 },
    );

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    headings.forEach((h) => h && observer.observe(h));
    return () => headings.forEach((h) => h && observer.unobserve(h));
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto py-8 pl-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted/60">
          On this page
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "border-l-2 py-1.5 text-sm transition-all duration-200",
                item.level === 3 ? "pl-6 text-[13px]" : "pl-4",
                activeId === item.id
                  ? "border-accent text-accent font-medium"
                  : "border-transparent text-muted/70 hover:border-glass-border-hover hover:text-primary",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
