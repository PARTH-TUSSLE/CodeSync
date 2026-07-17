import Link from "next/link";
import type { Issue } from "@/types/models";
import { IssueStatusBadge } from "@/components/issue/IssueStatusBadge";

interface IssueCardProps {
  issue: Issue;
  repoId: string;
}

export function IssueCard({ issue, repoId }: IssueCardProps) {
  const created = new Date(issue.createdAt).toLocaleDateString();

  return (
    <div className="flex items-start gap-3 glass-card p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/repos/${repoId}/issues/${issue.id}`}
            className="font-medium text-primary hover:text-accent"
          >
            {issue.title}
          </Link>
          <IssueStatusBadge status={issue.status} />
        </div>
        <p className="mt-1 text-sm text-muted">
          #{issue.id.slice(0, 7)} opened {created}
        </p>
      </div>
    </div>
  );
}
