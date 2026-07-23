import type { Metadata } from "next";
import { apiUrl } from "@/lib/api/urls";
import { BackButton } from "@/components/ui/BackButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RepoTabs } from "@/components/repo/RepoTabs";
import type { Commit } from "@/types/models";

export const metadata: Metadata = {
  title: "Commits — CodeSync",
};

interface CommitsResponse {
  msg: string;
  commits: Commit[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface RepoResponse {
  msg: string;
  repo: { name: string; ownerId: string };
}

async function fetchRepo(id: string): Promise<{ name: string; ownerId: string } | null> {
  try {
    const res = await fetch(apiUrl(`/repo/${id}`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.repo;
  } catch {
    return null;
  }
}

async function fetchCommits(
  repoId: string,
  page: number = 1,
  branch?: string,
): Promise<CommitsResponse | null> {
  try {
    const params = new URLSearchParams({ page: String(page), limit: "30" });
    if (branch) params.set("branch", branch);
    const res = await fetch(apiUrl(`/repo/${repoId}/commits?${params}`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CommitListPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; branch?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page || "1") || 1;
  const repo = await fetchRepo(id);
  const data = await fetchCommits(id, page, sp.branch);

  if (!repo) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
        <h1 className="text-2xl font-bold text-subtle">Repository not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-4">
        <BackButton />
      </div>
      <h1 className="mb-4 text-2xl font-bold text-primary">{repo.name}</h1>
      <RepoTabs repoId={id} />

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-primary mb-4">Commits</h2>

        {!data || data.commits.length === 0 ? (
          <EmptyState
            title="No commits yet"
            description="Push code using the CodeSync CLI to see commits here."
            actionLabel="View Docs"
            actionHref="/docs/cli"
          />
        ) : (
          <div className="space-y-1">
            {data.commits.map((commit, idx) => (
              <a
                key={commit.id}
                href={`/repos/${id}/commits/${commit.id}`}
                className="flex items-center gap-4 rounded-lg border border-glass-border bg-surface-elevated px-4 py-3 transition-colors hover:bg-glass-hover"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  {commit.author?.username?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-primary">
                    {commit.message}
                  </p>
                  <p className="text-xs text-muted">
                    {commit.author?.username && (
                      <span className="font-medium text-primary">{commit.author.username}</span>
                    )}
                    {commit.author?.username && <span> committed </span>}
                    {timeAgo(new Date(commit.createdAt))}
                    {commit.filesCount !== undefined && (
                      <span> · {commit.filesCount} file{commit.filesCount !== 1 ? "s" : ""}</span>
                    )}
                  </p>
                </div>
                <span className="font-mono text-xs text-subtle shrink-0">
                  {commit.id.slice(0, 7)}
                </span>
              </a>
            ))}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            {page > 1 && (
              <a
                href={`/repos/${id}/commits?page=${page - 1}`}
                className="rounded-lg border border-glass-border px-4 py-2 text-xs text-muted hover:text-primary transition-colors"
              >
                Previous
              </a>
            )}
            <span className="text-xs text-subtle">
              Page {page} of {data.totalPages}
            </span>
            {page < data.totalPages && (
              <a
                href={`/repos/${id}/commits?page=${page + 1}`}
                className="rounded-lg border border-glass-border px-4 py-2 text-xs text-muted hover:text-primary transition-colors"
              >
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}
