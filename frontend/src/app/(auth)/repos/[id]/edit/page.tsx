"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { apiUrl } from "@/lib/api/urls";
import { useToast } from "@/components/ui/Toast";
import { BackButton } from "@/components/ui/BackButton";
import type { Branch } from "@/types/models";

export default function EditFilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ path?: string; branch?: string }>;
}) {
  const [repoId, setRepoId] = useState("");
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [branch, setBranch] = useState("main");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [isNew, setIsNew] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    params.then((p) => setRepoId(p.id));
    searchParams.then((sp) => {
      setBranch(sp.branch || "main");
      if (sp.path) {
        setFilename(sp.path);
        setIsNew(false);
        setCommitMessage(`Update ${sp.path}`);
      } else {
        setCommitMessage("Create new file");
        setFetching(false);
      }
    });
  }, [params, searchParams]);

  useEffect(() => {
    if (!repoId) return;
    fetch(apiUrl(`/repo/${repoId}/branches`))
      .then((r) => r.json())
      .then((d) => setBranches(d.branches || []))
      .catch(() => {});
  }, [repoId]);

  useEffect(() => {
    if (!repoId || !filename || isNew) return;
    setFetching(true);
    fetch(apiUrl(`/repo/${repoId}/blob?branch=${encodeURIComponent(branch)}&path=${encodeURIComponent(filename)}`))
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.file?.content !== undefined) setContent(d.file.content);
        else setError("File not found");
      })
      .catch(() => setError("Failed to fetch file"))
      .finally(() => setFetching(false));
  }, [repoId, filename, branch, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!filename.trim()) { setError("Filename is required"); return; }
    if (!commitMessage.trim()) { setError("Commit message is required"); return; }

    setLoading(true);
    try {
      const data = await apiClient<{ msg: string; commit: { id: string } }>(
        `/repo/${repoId}/commits`,
        {
          method: "POST",
          body: {
            branch,
            message: commitMessage.trim(),
            files: [{ filename: filename.trim(), content }],
          },
        },
      );
      toast.success(isNew ? "File created!" : "File updated!");
      router.push(`/repos/${repoId}?branch=${encodeURIComponent(branch)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save file");
    } finally {
      setLoading(false);
    }
  };

  if (!repoId) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-4"><BackButton href={`/repos/${repoId}`} /></div>
      <div className="rounded-xl border border-glass-border bg-surface-elevated overflow-hidden">
        <div className="border-b border-glass-border bg-surface px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-primary">
            {isNew ? "Create new file" : `Edit ${filename}`}
          </h1>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="glass-input px-2 py-1 text-xs"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted whitespace-nowrap">File path:</span>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="src/components/Button.tsx"
              className="glass-input flex-1 px-3 py-1.5 text-xs font-mono"
              required
            />
          </div>

          <div>
            {fetching ? (
              <div className="h-64 flex items-center justify-center text-xs text-subtle bg-[#0d1117] rounded-lg">
                Loading file content...
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 px-3 py-2 text-xs font-mono leading-relaxed bg-[#0d1117] text-green-300 border border-glass-border rounded-lg resize-y focus:outline-none focus:border-accent"
                placeholder="Enter file content here..."
                spellCheck={false}
              />
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Commit message</label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe your changes"
              className="glass-input w-full px-3 py-2 text-sm"
              required
            />
          </div>

          {error && <p className="text-sm text-warm">{error}</p>}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading || fetching} className="btn-primary !py-2 !px-4 text-sm">
              {loading ? "Committing..." : "Commit changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/repos/${repoId}`)}
              className="rounded-lg border border-glass-border px-4 py-2 text-sm text-muted hover:text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
