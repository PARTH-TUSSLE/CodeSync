"use client";

import Link from "next/link";
import type { Repository } from "@/types/models";

interface PinnedReposGridProps {
  repos: Repository[];
}

export function PinnedReposGrid({ repos }: PinnedReposGridProps) {
  if (repos.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <svg className="size-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Pinned Repositories
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {repos.map((repo) => (
          <Link
            key={repo.id}
            href={`/repos/${repo.id}`}
            className="group relative overflow-hidden rounded-xl border border-glass-border bg-surface-elevated p-4 transition-all duration-300 hover:border-glass-border-hover hover:shadow-lg"
          >
            <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-glow/5 to-transparent" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2">
                <svg className="size-4 shrink-0 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
                <span className="truncate font-semibold text-primary transition-colors group-hover:text-accent">
                  {repo.name}
                </span>
                <span className={`ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  repo.visibility
                    ? "border-emerald/20 bg-emerald/10 text-emerald"
                    : "border-amber/20 bg-amber/10 text-amber"
                }`}>
                  <span className={`size-1.5 rounded-full ${
                    repo.visibility ? "bg-emerald" : "bg-amber"
                  }`} />
                  {repo.visibility ? "Public" : "Private"}
                </span>
              </div>
              {repo.description && (
                <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                  {repo.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
