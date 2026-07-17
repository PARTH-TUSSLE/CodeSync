"use client";

import { cn } from "@/lib/cn";

interface YearPickerProps {
  selectedYear: number;
  onChange: (year: number) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 2020;

export function YearPicker({ selectedYear, onChange }: YearPickerProps) {
  const canGoPrev = selectedYear > MIN_YEAR;
  const canGoNext = selectedYear < CURRENT_YEAR;

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-glass-border bg-surface p-0.5">
      <button
        type="button"
        disabled={!canGoPrev}
        onClick={() => onChange(selectedYear - 1)}
        className={cn(
          "rounded-md p-1.5 text-muted transition-colors",
          canGoPrev
            ? "hover:bg-glass-hover hover:text-primary"
            : "cursor-not-allowed opacity-30",
        )}
        aria-label="Previous year"
      >
        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="min-w-[4rem] text-center text-sm font-semibold text-primary tabular-nums">
        {selectedYear}
      </span>
      <button
        type="button"
        disabled={!canGoNext}
        onClick={() => onChange(selectedYear + 1)}
        className={cn(
          "rounded-md p-1.5 text-muted transition-colors",
          canGoNext
            ? "hover:bg-glass-hover hover:text-primary"
            : "cursor-not-allowed opacity-30",
        )}
        aria-label="Next year"
      >
        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
