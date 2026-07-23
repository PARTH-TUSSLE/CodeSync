"use client";

import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "@/lib/api/urls";
import type { Branch } from "@/types/models";

interface BranchSelectorProps {
  repoId: string;
  currentBranch: string;
  onBranchChange: (branch: string) => void;
}

export function BranchSelector({ repoId, currentBranch, onBranchChange }: BranchSelectorProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(apiUrl(`/repo/${repoId}/branches`))
      .then((r) => r.json())
      .then((d) => setBranches(d.branches || []))
      .catch(() => {});
  }, [repoId]);

  const handleSelect = useCallback((name: string) => {
    onBranchChange(name);
    setOpen(false);
  }, [onBranchChange]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md border border-glass-border bg-surface-elevated px-2.5 py-1 text-xs text-muted hover:text-primary transition-colors"
      >
        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="font-medium">{currentBranch}</span>
        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-lg border border-glass-border bg-surface-tertiary/95 backdrop-blur-2xl shadow-elevated">
            <div className="border-b border-glass-border px-3 py-2 text-xs font-medium text-subtle">
              Branches
            </div>
            <div className="max-h-60 overflow-y-auto">
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelect(b.name)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-glass-hover ${
                    b.name === currentBranch ? "text-accent" : "text-muted"
                  }`}
                >
                  <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{b.name}</span>
                  {b.isDefault && <span className="ml-auto text-subtle">default</span>}
                </button>
              ))}
              {branches.length === 0 && (
                <div className="px-3 py-4 text-center text-xs text-subtle">No branches</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
