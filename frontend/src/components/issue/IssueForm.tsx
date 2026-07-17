"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api/client";

interface IssueFormProps {
  repoId: string;
  initialTitle?: string;
  initialDescription?: string;
  mode: "create" | "edit";
  issueId?: string;
  onSuccess: (issueId?: string) => void;
  onCancel?: () => void;
}

export function IssueForm({
  repoId,
  initialTitle = "",
  initialDescription = "",
  mode,
  issueId,
  onSuccess,
  onCancel,
}: IssueFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    setLoading(true);
    try {
      if (mode === "create") {
        interface CreateResponse {
          msg: string;
          createdIssue: { id: string };
        }
        const data = await apiClient<CreateResponse>("/issue/create", {
          method: "POST",
          body: {
            title: title.trim(),
            description: description.trim(),
            status: "open",
            repoID: repoId,
          },
        });
        onSuccess(data.createdIssue.id);
      } else {
        await apiClient(`/issue/update/${issueId}`, {
          method: "PUT",
          body: {
            title: title.trim(),
            description: description.trim(),
          },
        });
        onSuccess();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save issue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-muted"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue title"
          className="glass-input w-full px-3 py-2 text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-muted"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue..."
          rows={6}
          className="glass-input w-full px-3 py-2 text-sm"
          required
        />
      </div>
      {error && (
        <p className="text-sm text-warm">{error}</p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 py-2 text-sm"
        >
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Issue"
              : "Save Changes"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost px-6 py-2 text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
