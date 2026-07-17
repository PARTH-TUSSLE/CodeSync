import Link from "next/link";
import { apiUrl } from "@/lib/api/urls";
import type { Issue } from "@/types/models";

interface IssueCountBadgesProps {
  repoId: string;
}

async function fetchIssueCounts(
  repoId: string,
): Promise<{ open: number; closed: number }> {
  try {
    const res = await fetch(apiUrl(`/allIssues/${repoId}`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.status === 404) return { open: 0, closed: 0 };
    if (!res.ok) return { open: 0, closed: 0 };
    const data: { issues: Issue[] } = await res.json();
    const issues = data.issues ?? [];
    return {
      open: issues.filter((i) => i.status === "open").length,
      closed: issues.filter((i) => i.status === "closed").length,
    };
  } catch {
    return { open: 0, closed: 0 };
  }
}

export async function IssueCountBadges({
  repoId,
}: IssueCountBadgesProps) {
  const counts = await fetchIssueCounts(repoId);

  return (
    <Link
      href={`/repos/${repoId}/issues`}
      className="inline-flex items-center gap-3 rounded-lg glass-card px-4 py-3 text-sm"
    >
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-green-500" />
        <span className="font-medium text-primary">
          {counts.open}
        </span>
        <span className="text-muted">Open</span>
      </span>
      <span className="text-subtle">|</span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-red-500" />
        <span className="font-medium text-primary">
          {counts.closed}
        </span>
        <span className="text-muted">Closed</span>
      </span>
      <span className="ml-2 text-xs text-accent">
        View all &rarr;
      </span>
    </Link>
  );
}
