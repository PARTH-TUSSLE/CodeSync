"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";
import { BackButton } from "@/components/ui/BackButton";

export default function CreateRepoPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Repository name is required");
      return;
    }
    setLoading(true);
    try {
      interface CreateRepoResponse {
        msg: string;
        createdRepo: { id: string };
      }
      const data = await apiClient<CreateRepoResponse>("/repo/create", {
        method: "POST",
        body: {
          name: name.trim(),
          description: description.trim() || undefined,
          content: [],
          visibility,
        },
      });
      toast.success("Repository created!");
      router.push(`/repos/${data.createdRepo.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create repository";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="rounded-xl border border-glass-border bg-surface-elevated p-6 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-primary">
          Create Repository
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-muted"
            >
              Repository Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-repo"
              className="glass-input w-full px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-muted"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your repository"
              rows={3}
              className="glass-input w-full px-3 py-2 text-sm resize-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label
              htmlFor="visibility"
              className="text-sm font-medium text-muted"
            >
              Public
            </label>
            <button
              type="button"
              id="visibility"
              role="switch"
              aria-checked={visibility}
              onClick={() => setVisibility(!visibility)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                visibility
                  ? "bg-accent"
                  : "bg-glass-border"
              }`}
            >
              <span
                className={`inline-block size-3.5 rounded-full bg-white transition-transform ${
                  visibility ? "translate-x-4.5" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-xs text-subtle">
              {visibility ? "Anyone can view" : "Only you can view"}
            </span>
          </div>
          {error && (
            <p className="text-sm text-warm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Creating..." : "Create Repository"}
          </button>
        </form>
      </div>
    </div>
  );
}
