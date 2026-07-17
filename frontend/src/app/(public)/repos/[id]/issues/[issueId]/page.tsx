import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { IssueStatusBadge } from "@/components/issue/IssueStatusBadge";
import { IssueStatusToggle } from "@/components/issue/IssueStatusToggle";
import { DeleteIssueButton } from "@/components/issue/DeleteIssueButton";
import { EditIssueButton } from "@/components/issue/EditIssueButton";
import Link from "next/link";
import type { Issue } from "@/types/models";

export const metadata: Metadata = {
  title: "Issue — CodeSync",
};

interface IssueResponse {
  msg: string;
  issue: Issue;
}

async function fetchIssue(issueId: string): Promise<Issue | null> {
  try {
    const res = await fetch(apiUrl(`/issue/${issueId}`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: IssueResponse = await res.json();
    return data.issue;
  } catch {
    return null;
  }
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string; issueId: string }>;
}) {
  const { id: repoId, issueId } = await params;
  const token = await getTokenFromCookies();
  const issue = await fetchIssue(issueId);

  if (!issue) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
        <h1 className="text-2xl font-bold text-subtle">
          Issue not found
        </h1>
        <Link
          href={`/repos/${repoId}/issues`}
          className="text-sm text-accent hover:text-accent-soft transition-colors"
        >
          Back to issues
        </Link>
      </div>
    );
  }

  const created = new Date(issue.createdAt).toLocaleDateString();
  const updated = new Date(issue.updatedAt).toLocaleDateString();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link
        href={`/repos/${repoId}/issues`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to issues
      </Link>

      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-primary">
              {issue.title}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted">
              <IssueStatusBadge status={issue.status} />
              <span>
                #{issue.id.slice(0, 7)} opened {created}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {token && (
              <>
                <IssueStatusToggle
                  issueId={issueId}
                  currentStatus={issue.status}
                />
                <EditIssueButton
                  repoId={repoId}
                  issue={issue}
                />
                <DeleteIssueButton
                  repoId={repoId}
                  issueId={issueId}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-glass-border bg-surface-tertiary p-6">
        <p className="whitespace-pre-wrap text-sm text-primary">
          {issue.description}
        </p>
      </div>

      {updated !== created && (
        <p className="mt-4 text-xs text-subtle">
          Last updated {updated}
        </p>
      )}
    </div>
  );
}
