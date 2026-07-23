import type { Metadata } from "next";
import { apiUrl } from "@/lib/api/urls";
import { BackButton } from "@/components/ui/BackButton";
import { RepoTabs } from "@/components/repo/RepoTabs";
import Link from "next/link";
import type { Commit } from "@/types/models";

export const metadata: Metadata = {
  title: "Compare branches — CodeSync",
};

interface CompareResponse {
  msg: string;
  baseBranch: string;
  headBranch: string;
  aheadBy: number;
  behindBy: number;
  files: Array<{
    filename: string;
    status: "added" | "deleted" | "modified";
    additions: number;
    deletions: number;
    diff: string;
  }>;
  commits: Commit[];
}

async function fetchCompare(repoId: string, base: string, head: string): Promise<CompareResponse | null> {
  try {
    const res = await fetch(
      apiUrl(`/repo/${repoId}/compare?base=${encodeURIComponent(base)}&head=${encodeURIComponent(head)}`),
      { headers: { "Content-Type": "application/json" }, cache: "no-store" },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

export default async function CompareBranchesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ base?: string; head?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const base = sp.base || "main";
  const head = sp.head || "";

  const data = head ? await fetchCompare(id, base, head) : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-4"><BackButton href={`/repos/${id}`} /></div>
      <RepoTabs repoId={id} />

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Compare branches</h2>

        <form className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-glass" action={`/repos/${id}/compare`} method="GET">
          <span className="text-xs text-muted whitespace-nowrap">base:</span>
          <input name="base" defaultValue={base} className="glass-input px-2 py-1.5 text-xs font-mono w-24" />
          <svg className="size-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span className="text-xs text-muted whitespace-nowrap">head:</span>
          <input name="head" defaultValue={head} className="glass-input px-2 py-1.5 text-xs font-mono w-24" required />
          <button type="submit" className="rounded bg-accent px-3 py-1.5 text-xs text-white">
            Compare
          </button>
        </form>

        {!head ? (
          <p className="text-sm text-muted">Enter a head branch to compare.</p>
        ) : !data ? (
          <p className="text-sm text-warm">Could not load comparison.</p>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-4 text-sm">
              <span className="text-muted">
                Comparing <span className="font-mono font-medium text-primary">{base}</span>
                <span className="mx-1">...</span>
                <span className="font-mono font-medium text-primary">{head}</span>
              </span>
              <span className="rounded bg-glass px-2 py-0.5 text-xs text-subtle">
                {data.aheadBy} ahead
              </span>
              <span className="rounded bg-glass px-2 py-0.5 text-xs text-subtle">
                {data.behindBy} behind
              </span>
            </div>

            {data.commits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-primary mb-2">Commits on {head}</h3>
                <div className="space-y-1">
                  {data.commits.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg border border-glass-border bg-surface-elevated px-4 py-2">
                      <span className="text-xs text-muted">{c.author?.username}</span>
                      <span className="text-xs text-primary truncate flex-1">{c.message}</span>
                      <span className="font-mono text-[10px] text-subtle">{c.id.slice(0, 7)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.files.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-primary mb-2">
                  {data.files.length} file{data.files.length !== 1 ? "s" : ""} changed
                </h3>
                <div className="space-y-3">
                  {data.files.map((file) => (
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
                      <div className="bg-[#0d1117] overflow-x-auto">
                        {file.diff.split("\n").map((line, i) => (
                          <DiffLine key={i} line={line} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.files.length === 0 && (
              <p className="text-sm text-subtle">No differences between these branches.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
