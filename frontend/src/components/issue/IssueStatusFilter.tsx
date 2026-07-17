"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

interface IssueStatusFilterProps {
  repoId: string;
  current: string;
  openCount: number;
  closedCount: number;
}

const tabs = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
] as const;

export function IssueStatusFilter({
  repoId,
  current,
  openCount,
  closedCount,
}: IssueStatusFilterProps) {
  const router = useRouter();

  const getCount = (key: string) => {
    if (key === "open") return openCount;
    if (key === "closed") return closedCount;
    return openCount + closedCount;
  };

  return (
    <div className="flex gap-1 rounded-lg border border-glass-border bg-surface-secondary p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => {
            const params = new URLSearchParams();
            if (tab.key !== "all") params.set("status", tab.key);
            const qs = params.toString();
            router.push(`/repos/${repoId}/issues${qs ? `?${qs}` : ""}`);
          }}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              current === tab.key
              ? "bg-surface text-primary shadow-sm"
              : "text-muted hover:text-primary",
          )}
        >
          {tab.label}
          <span className="ml-1.5 text-xs text-subtle">
            {getCount(tab.key)}
          </span>
        </button>
      ))}
    </div>
  );
}
