"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface DeleteIssueButtonProps {
  repoId: string;
  issueId: string;
}

export function DeleteIssueButton({
  repoId,
  issueId,
}: DeleteIssueButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await apiClient(`/issue/delete/${issueId}`, { method: "DELETE" });
      toast.success("Issue deleted");
      router.push(`/repos/${repoId}/issues`);
    } catch {
      toast.error("Failed to delete issue");
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded-lg border border-warm/30 px-3 py-2 text-sm font-medium text-warm hover:bg-warm/15"
      >
        Delete
      </button>
      <ConfirmDialog
        open={showConfirm}
        title="Delete issue?"
        message="This will permanently delete this issue. This cannot be undone."
        confirmLabel={loading ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
