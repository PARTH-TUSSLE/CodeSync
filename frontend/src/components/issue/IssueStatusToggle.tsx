"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";

interface IssueStatusToggleProps {
  issueId: string;
  currentStatus: "open" | "closed";
}

export function IssueStatusToggle({
  issueId,
  currentStatus,
}: IssueStatusToggleProps) {
  const [optimisticStatus, setOptimisticStatus] = useState<
    "open" | "closed" | null
  >(null);
  const router = useRouter();
  const toast = useToast();

  const displayStatus = optimisticStatus ?? currentStatus;
  const loading = optimisticStatus !== null;

  const handleToggle = async () => {
    const newStatus = displayStatus === "open" ? "closed" : "open";
    setOptimisticStatus(newStatus);
    try {
      await apiClient(`/issue/update/${issueId}`, {
        method: "PUT",
        body: { status: newStatus },
      });
      toast.success(
        newStatus === "closed" ? "Issue closed" : "Issue reopened",
      );
      router.refresh();
    } catch {
      setOptimisticStatus(null);
      toast.error("Failed to update issue status");
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
        displayStatus === "open"
          ? "border-warm/30 text-warm hover:bg-warm/15"
          : "border-emerald/30 text-emerald hover:bg-emerald/15"
      }`}
    >
      {loading
        ? "Updating..."
        : displayStatus === "open"
          ? "Close issue"
          : "Reopen issue"}
    </button>
  );
}
