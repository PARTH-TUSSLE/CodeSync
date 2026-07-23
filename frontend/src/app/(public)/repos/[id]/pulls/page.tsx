import type { Metadata } from "next";
import Link from "next/link";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { BackButton } from "@/components/ui/BackButton";
import { RepoTabs } from "@/components/repo/RepoTabs";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PullRequest } from "@/types/models";

export const metadata: Metadata = {
  title: "Pull Requests — CodeSync",
};

interface PRListResponse {
  msg: string;
  pullRequests: PullRequest[];
  total: number;
  page: number;
  totalPages: number;
}

async function fetchPRs(
  repoId: string,
  status?: string,
  page: number = 1,
): Promise<PRListResponse | null> {
  try {
    const params = new URLSearchParams({ page: String(page), limit: "30" });
    if (status) params.set("status", status);
    const res = await fetch(apiUrl(`/repo/${repoId}/pulls?${params}`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchRepoName(repoId: string): Promise<string | null> {
  try {
    const res = await fetch(apiUrl(`/repo/${repoId}`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.repo?.name || null;
  } catch {
    return null;
  }
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  return date.toLocaleDateString();
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: "bg-green-900/30 text-green-400 border-green-800",
    merged: "bg-purple-900/30 text-purple-400 border-purple-800",
    closed: "bg-red-900/30 text-red-400 border-red-800",
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[status] || colors.open}`}>
      {status === "open" ? "Open" : status === "merged" ? "Merged" : "Closed"}
    </span>
  );
}

export default async function PullRequestListPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const status = sp.status || undefined;
  const page = parseInt(sp.page || "1") || 1;
  const token = await getTokenFromCookies();
  const [repoName, data] = await Promise.all([
    fetchRepoName(id),
    fetchPRs(id, status, page),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-4">
        <BackButton />
      </div>
      <h1 className="mb-4 text-2xl font-bold text-primary">{repoName || "Repository"}</h1>
      <RepoTabs repoId={id} />

      <div className="mt-4 flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary">Pull Requests</h2>
        {token && (
          <Link
            href={`/repos/${id}/pulls/new`}
            className="btn-primary !py-1.5 !px-3 text-xs"
          >
            New Pull Request
          </Link>
        )}
      </div>

      <div className="mb-4 flex gap-2 text-sm">
        {["open", "merged", "closed"].map((s) => (
          <Link
            key={s}
            href={`/repos/${id}/pulls?status=${s}`}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              (status || "open") === s
                ? "border-accent text-accent bg-accent/5"
                : "border-glass-border text-muted hover:text-primary"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Link>
        ))}
        <Link
          href={`/repos/${id}/pulls`}
          className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
            !status ? "border-accent text-accent bg-accent/5" : "border-glass-border text-muted hover:text-primary"
          }`}
        >
          All
        </Link>
      </div>

      {!data || data.pullRequests.length === 0 ? (
        <EmptyState
          title="No pull requests"
          description="Create a pull request to propose changes."
          actionLabel={token ? "Create Pull Request" : undefined}
          actionHref={token ? `/repos/${id}/pulls/new` : undefined}
        />
      ) : (
        <div className="space-y-1">
          {data.pullRequests.map((pr) => (
            <Link
              key={pr.id}
              href={`/repos/${id}/pulls/${pr.id}`}
              className="flex items-center gap-4 rounded-lg border border-glass-border bg-surface-elevated px-4 py-3 transition-colors hover:bg-glass-hover"
            >
              <StatusBadge status={pr.status} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary truncate">{pr.title}</p>
                <p className="text-xs text-muted">
                  {pr.author?.username && <span className="font-medium">{pr.author.username}</span>}
                  {pr.author?.username && <span> </span>}
                  wants to merge into <span className="font-mono text-subtle">{pr.targetBranch}</span>
                  <span className="mx-1">·</span>
                  {timeAgo(new Date(pr.createdAt))}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted shrink-0">
                <span>{pr.sourceBranch}</span>
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>{pr.targetBranch}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {page > 1 && (
            <Link
              href={`/repos/${id}/pulls?page=${page - 1}${status ? `&status=${status}` : ""}`}
              className="rounded-lg border border-glass-border px-4 py-2 text-xs text-muted hover:text-primary"
            >
              Previous
            </Link>
          )}
          <span className="text-xs text-subtle">Page {page} of {data.totalPages}</span>
          {page < data.totalPages && (
            <Link
              href={`/repos/${id}/pulls?page=${page + 1}${status ? `&status=${status}` : ""}`}
              className="rounded-lg border border-glass-border px-4 py-2 text-xs text-muted hover:text-primary"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
