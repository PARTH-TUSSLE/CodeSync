"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface DeleteRepoButtonProps {
  repoId: string;
  repoName: string;
}

export function DeleteRepoButton({ repoId, repoName }: DeleteRepoButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiClient(`/repo/delete/${repoId}`, { method: "DELETE" });
      toast.success("Repository deleted");
      router.push("/repos");
    } catch {
      toast.error("Failed to delete repository");
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded-lg border border-glass-border px-4 py-2 text-sm font-medium text-warm hover:bg-warm/15"
      >
        Delete repository
      </button>
      <ConfirmDialog
        open={showConfirm}
        title={`Delete ${repoName}?`}
        message="This will permanently delete the repository and all associated issues. This cannot be undone."
        confirmLabel={loading ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        requireTyping={repoName}
      />
    </>
  );
}
