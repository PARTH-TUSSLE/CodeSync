"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface StarButtonProps {
  repoId: string;
  isStarred: boolean;
}

export function StarButton({ repoId, isStarred }: StarButtonProps) {
  const [optimisticStarred, setOptimisticStarred] = useState(isStarred);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  if (!isAuthenticated) return null;

  const handleToggle = async () => {
    const previous = optimisticStarred;
    setOptimisticStarred(!optimisticStarred);
    setLoading(true);
    try {
      const endpoint = optimisticStarred ? `/unstar/${repoId}` : `/star/${repoId}`;
      await apiClient(endpoint, { method: "PUT" });
      router.refresh();
    } catch {
      setOptimisticStarred(previous);
      toast.error("Failed to update star");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        optimisticStarred
          ? "badge-amber"
          : "border-glass-border bg-surface-secondary text-muted hover:bg-surface-elevated"
      }`}
    >
      <svg className="size-4" fill={optimisticStarred ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
      {optimisticStarred ? "Starred" : "Star"}
    </button>
  );
}
