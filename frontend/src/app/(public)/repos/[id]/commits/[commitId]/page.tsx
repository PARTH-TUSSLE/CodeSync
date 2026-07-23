import type { Metadata } from "next";
import { apiUrl } from "@/lib/api/urls";
import { BackButton } from "@/components/ui/BackButton";
import { RepoTabs } from "@/components/repo/RepoTabs";
import type { CommitDetail, CommitDiff } from "@/types/models";

export const metadata: Metadata = {
  title: "Commit — CodeSync",
};

interface CommitResponse {
  msg: string;
  commit: CommitDetail;
}

async function fetchCommit(repoId: string, commitId: string): Promise<CommitDetail | null> {
  try {
    const res = await fetch(apiUrl(`/repo/${repoId}/commits/${commitId}`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: CommitResponse = await res.json();
    return data.commit;
  } catch {
    return null;
  }
}

async function fetchDiff(repoId: string, commitId: string): Promise<CommitDiff | null> {
  try {
    const res = await fetch(apiUrl(`/repo/${repoId}/commits/${commitId}/diff`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function DiffLine({ line }: { line: string }) {
  if (!line) return <br />;
  const char = line[0];
  const content = line.slice(1);
  if (char === "+") {
    return (
      <div className="flex text-xs leading-relaxed">
        <span className="w-10 shrink-0 bg-green-900/20 text-right pr-2 text-green-400 select-none">+</span>
        <span className="flex-1 bg-green-900/10 text-green-300 px-2">{escapeHtml(content)}</span>
      </div>
    );
  }
  if (char === "-") {
    return (
      <div className="flex text-xs leading-relaxed">
        <span className="w-10 shrink-0 bg-red-900/20 text-right pr-2 text-red-400 select-none">-</span>
        <span className="flex-1 bg-red-900/10 text-red-300 px-2">{escapeHtml(content)}</span>
      </div>
    );
  }
  return (
    <div className="flex text-xs leading-relaxed">
      <span className="w-10 shrink-0 text-right pr-2 text-subtle select-none">&nbsp;</span>
      <span className="flex-1 text-muted px-2">{escapeHtml(line)}</span>
    </div>
  );
}

export default async function CommitDetailPage({
  params,
}: {
  params: Promise<{ id: string; commitId: string }>;
}) {
  const { id, commitId } = await params;
  const [commit, diff] = await Promise.all([
    fetchCommit(id, commitId),
    fetchDiff(id, commitId),
  ]);

  if (!commit) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
        <h1 className="text-2xl font-bold text-subtle">Commit not found</h1>
      </div>
    );
  }

  const totalAdditions = commit.files?.reduce((s, f) => s + f.additions, 0) || 0;
  const totalDeletions = commit.files?.reduce((s, f) => s + f.deletions, 0) || 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-4">
        <BackButton />
      </div>
      <RepoTabs repoId={id} />

      <div className="mt-6 rounded-xl border border-glass-border bg-surface-elevated p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-primary">{commit.message}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
              {commit.author?.username && (
                <span className="font-medium text-primary">{commit.author.username}</span>
              )}
              <span>committed {new Date(commit.createdAt).toLocaleString()}</span>
              <span className="font-mono text-subtle">{commitId}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs">
            {totalAdditions > 0 && (
              <span className="rounded bg-green-900/20 px-2 py-0.5 text-green-400 font-medium">
                +{totalAdditions}
              </span>
            )}
            {totalDeletions > 0 && (
              <span className="rounded bg-red-900/20 px-2 py-0.5 text-red-400 font-medium">
                -{totalDeletions}
              </span>
            )}
          </div>
        </div>
      </div>

      {commit.files && commit.files.length > 0 && (
        <div className="mt-4 rounded-xl border border-glass-border">
          <div className="border-b border-glass-border px-4 py-2 text-xs font-medium text-muted">
            {commit.files.length} file{commit.files.length !== 1 ? "s" : ""} changed
          </div>
          <div className="divide-y divide-glass-border">
            {commit.files.map((file) => (
              <div key={file.id}>
                <div className="flex items-center justify-between bg-surface-elevated px-4 py-2">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="text-sm font-medium text-primary">{file.filename}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {file.additions > 0 && <span className="text-green-400">+{file.additions}</span>}
                    {file.deletions > 0 && <span className="text-red-400">-{file.deletions}</span>}
                    <span className="text-subtle">{formatBytes(file.size)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {diff?.files && diff.files.length > 0 && (
        <div className="mt-4 space-y-4">
          {diff.files.map((file) => (
            <div key={file.filename} className="rounded-xl border border-glass-border overflow-hidden">
              <div className="flex items-center justify-between bg-surface-elevated px-4 py-2 border-b border-glass-border">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    file.status === "added" ? "bg-green-900/20 text-green-400" :
                    file.status === "deleted" ? "bg-red-900/20 text-red-400" :
                    "bg-accent/10 text-accent"
                  }`}>
                    {file.status === "added" ? "A" : file.status === "deleted" ? "D" : "M"}
                  </span>
                  <span className="text-sm font-medium text-primary">{file.filename}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-400">+{file.additions}</span>
                  <span className="text-red-400">-{file.deletions}</span>
                </div>
              </div>
              <div className="bg-[#0d1117] px-0 py-0 overflow-x-auto">
                {file.diff.split("\n").map((line, i) => (
                  <DiffLine key={i} line={line} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
