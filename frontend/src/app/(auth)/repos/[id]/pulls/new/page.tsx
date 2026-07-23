"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiClient } from "@/lib/api/client";
import { apiUrl } from "@/lib/api/urls";
import { useToast } from "@/components/ui/Toast";
import { BackButton } from "@/components/ui/BackButton";
import type { Branch } from "@/types/models";

export default function CreatePRPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [repoId, setRepoId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceBranch, setSourceBranch] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    params.then((p) => {
      setRepoId(p.id);
      fetch(apiUrl(`/repo/${p.id}/branches`))
        .then((r) => r.json())
        .then((d) => {
          const bs = d.branches || [];
          setBranches(bs);
          const def = bs.find((b: Branch) => b.isDefault);
          setTargetBranch(def?.name || bs[0]?.name || "main");
        })
        .catch(() => {});
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Title is required"); return; }
    if (!sourceBranch) { setError("Source branch is required"); return; }
    if (!targetBranch) { setError("Target branch is required"); return; }
    if (sourceBranch === targetBranch) { setError("Source and target branches must be different"); return; }

    setLoading(true);
    try {
      const data = await apiClient<{ msg: string; pullRequest: { id: string } }>(
        `/repo/${repoId}/pulls`,
        {
          method: "POST",
          body: {
            title: title.trim(),
            description: description.trim() || undefined,
            sourceBranch,
            targetBranch,
          },
        },
      );
      toast.success("Pull request created!");
      router.push(`/repos/${repoId}/pulls/${data.pullRequest.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create PR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-2xl px-6 py-8">
      <div className="mb-4"><BackButton /></div>
      <div className="rounded-xl border border-glass-border bg-surface-elevated p-6 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-primary">New Pull Request</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-glass">
            <select
              value={sourceBranch}
              onChange={(e) => setSourceBranch(e.target.value)}
              className="glass-input px-2 py-1.5 text-xs"
            >
              <option value="">Select source branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
            <svg className="size-4 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <select
              value={targetBranch}
              onChange={(e) => setTargetBranch(e.target.value)}
              className="glass-input px-2 py-1.5 text-xs"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-muted">Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Summary of changes" className="glass-input w-full px-3 py-2 text-sm" required />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-muted">Description (optional)</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the changes and motivation" rows={5}
              className="glass-input w-full px-3 py-2 text-sm resize-none" />
          </div>

          {error && <p className="text-sm text-warm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create Pull Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
