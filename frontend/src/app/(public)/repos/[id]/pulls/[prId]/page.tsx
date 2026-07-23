import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { BackButton } from "@/components/ui/BackButton";
import { RepoTabs } from "@/components/repo/RepoTabs";
import type { PullRequest, PRReview, PRComment } from "@/types/models";

export const metadata: Metadata = {
  title: "Pull Request — CodeSync",
};

interface PRDetailResponse {
  msg: string;
  pullRequest: PullRequest & { reviewers: PRReview[]; comments: PRComment[] };
}

async function fetchPR(repoId: string, prId: string): Promise<PRDetailResponse["pullRequest"] | null> {
  try {
    const res = await fetch(apiUrl(`/repo/${repoId}/pulls/${prId}`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: PRDetailResponse = await res.json();
    return data.pullRequest;
  } catch {
    return null;
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: "bg-green-900/30 text-green-400 border-green-800",
    merged: "bg-purple-900/30 text-purple-400 border-purple-800",
    closed: "bg-red-900/30 text-red-400 border-red-800",
  };
  return (
    <span className={`rounded-full border px-3 py-0.5 text-sm font-medium ${colors[status] || ""}`}>
      {status === "open" ? "Open" : status === "merged" ? "Merged" : "Closed"}
    </span>
  );
}

export default async function PRDetailPage({
  params,
}: {
  params: Promise<{ id: string; prId: string }>;
}) {
  const { id, prId } = await params;
  const token = await getTokenFromCookies();
  const pr = await fetchPR(id, prId);

  if (!pr) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
        <h1 className="text-2xl font-bold text-subtle">Pull request not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-4">
        <BackButton href={`/repos/${id}/pulls`} />
      </div>
      <RepoTabs repoId={id} />

      <div className="mt-4">
        <div className="flex items-center gap-3 mb-2">
          <StatusBadge status={pr.status} />
          <h1 className="text-2xl font-bold text-primary">{pr.title}</h1>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted mb-4">
          {pr.author?.username && (
            <span className="font-medium text-primary">{pr.author.username}</span>
          )}
          <span>wants to merge</span>
          <span className="font-mono text-subtle">{pr.sourceBranch}</span>
          <span>into</span>
          <span className="font-mono text-subtle">{pr.targetBranch}</span>
          <span>· Created {new Date(pr.createdAt).toLocaleDateString()}</span>
        </div>

        {pr.description && (
          <div className="mb-6 rounded-xl border border-glass-border bg-surface-elevated p-4">
            <p className="text-sm text-primary whitespace-pre-wrap">{pr.description}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-medium text-primary mb-2">Comments</h3>
          {pr.comments && pr.comments.length > 0 ? (
            <div className="space-y-3">
              {pr.comments.map((c) => (
                <div key={c.id} className="rounded-lg border border-glass-border bg-surface-elevated p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary">{c.user?.username || "Unknown"}</span>
                    <span className="text-xs text-subtle">{new Date(c.createdAt).toLocaleString()}</span>
                    {c.filePath && (
                      <span className="text-xs text-muted ml-auto">{c.filePath}:{c.lineNumber}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted whitespace-pre-wrap">{c.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-subtle">No comments yet.</p>
          )}
        </div>

        {pr.reviewers && pr.reviewers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-primary mb-2">Reviews</h3>
            <div className="space-y-3">
              {pr.reviewers.map((r) => (
                <div key={r.id} className="rounded-lg border border-glass-border bg-surface-elevated p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary">{r.user?.username || "Unknown"}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      r.status === "approved" ? "bg-green-900/20 text-green-400" :
                      r.status === "changes_requested" ? "bg-red-900/20 text-red-400" :
                      "bg-glass text-muted"
                    }`}>
                      {r.status === "approved" ? "Approved" :
                       r.status === "changes_requested" ? "Changes requested" : "Comment"}
                    </span>
                    <span className="text-xs text-subtle">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  {r.body && <p className="text-sm text-muted whitespace-pre-wrap">{r.body}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {token && pr.status === "open" && (
          <MergePRButton repoId={id} prId={prId} />
        )}
      </div>
    </div>
  );
}

function MergePRButton({ repoId, prId }: { repoId: string; prId: string }) {
  return (
    <form
      action={`/api/repo/${repoId}/pulls/${prId}/merge`}
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem("codesync_token");
          const res = await fetch(`http://localhost:8000/repo/${repoId}/pulls/${prId}/merge`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            window.location.reload();
          } else {
            const data = await res.json();
            alert(data.msg || "Failed to merge");
          }
        } catch {
          alert("Failed to merge pull request");
        }
      }}
    >
      <button
        type="submit"
        className="btn-primary !py-2 !px-6 text-sm"
      >
        Merge Pull Request
      </button>
    </form>
  );
}
