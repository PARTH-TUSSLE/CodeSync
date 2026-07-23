import type { Metadata } from "next";
import { apiUrl } from "@/lib/api/urls";
import { BackButton } from "@/components/ui/BackButton";
import { RepoTabs } from "@/components/repo/RepoTabs";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Branch } from "@/types/models";

export const metadata: Metadata = {
  title: "Branches — CodeSync",
};

interface BranchesResponse {
  msg: string;
  defaultBranch: string;
  branches: Branch[];
}

interface RepoResponse {
  msg: string;
  repo: { name: string };
}

async function fetchRepo(id: string): Promise<{ name: string } | null> {
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

async function fetchBranches(repoId: string): Promise<BranchesResponse | null> {
  try {
    const res = await fetch(apiUrl(`/repo/${repoId}/branches`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
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

export default async function BranchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [repo, data] = await Promise.all([
    fetchRepo(id),
    fetchBranches(id),
  ]);

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
        <h2 className="text-lg font-semibold text-primary mb-4">Branches</h2>

        {!data || data.branches.length === 0 ? (
          <EmptyState
            title="No branches"
            description="This repository only has a default branch."
          />
        ) : (
          <div className="space-y-1">
            {data.branches.map((branch) => (
              <div
                key={branch.id}
                className="flex items-center justify-between rounded-lg border border-glass-border bg-surface-elevated px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <svg className="size-5 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">{branch.name}</span>
                      {branch.isDefault && (
                        <span className="rounded-full border border-glass-border px-2 py-0.5 text-[10px] text-subtle">
                          default
                        </span>
                      )}
                    </div>
                    {branch.latestCommit && (
                      <p className="mt-0.5 text-xs text-muted truncate">
                        {branch.latestCommit.message}
                      </p>
                    )}
                    {branch.commitCount !== undefined && (
                      <p className="text-xs text-subtle">
                        {branch.commitCount} commit{branch.commitCount !== 1 ? "s" : ""}
                        {branch.latestCommit && (
                          <> · Updated {timeAgo(new Date(branch.latestCommit.createdAt))}</>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={`/repos/${id}?branch=${branch.name}`}
                    className="rounded-lg border border-glass-border px-3 py-1.5 text-xs text-muted hover:text-primary transition-colors"
                  >
                    Browse
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
