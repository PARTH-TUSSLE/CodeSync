"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface RepoTabsProps {
  repoId: string;
}

const tabs = [
  { label: "Code", href: "", match: (p: string, id: string) => p === `/repos/${id}` },
  { label: "Issues", href: "/issues", match: (p: string, id: string) => p.startsWith(`/repos/${id}/issues`) },
  { label: "Pull Requests", href: "/pulls", match: (p: string, id: string) => p.startsWith(`/repos/${id}/pulls`) },
  { label: "Commits", href: "/commits", match: (p: string, id: string) => p.startsWith(`/repos/${id}/commits`) },
  { label: "Branches", href: "/branches", match: (p: string, id: string) => p.startsWith(`/repos/${id}/branches`) },
];

export function RepoTabs({ repoId }: RepoTabsProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-glass-border">
      <nav className="-mb-px flex gap-0">
        {tabs.map((tab) => {
          const isActive = tab.match(pathname, repoId);
          return (
            <Link
              key={tab.label}
              href={`/repos/${repoId}${tab.href}`}
              className={cn(
                "relative px-4 py-3 text-xs font-medium transition-colors",
                isActive
                  ? "text-accent"
                  : "text-muted hover:text-primary",
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
