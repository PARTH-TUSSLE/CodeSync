"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface PinButtonProps {
  repoId: string;
  isPinned: boolean;
}

export function PinButton({ repoId, isPinned }: PinButtonProps) {
  const [optimisticPinned, setOptimisticPinned] = useState(isPinned);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  if (!isAuthenticated) return null;

  const handleToggle = async () => {
    const previous = optimisticPinned;
    setOptimisticPinned(!optimisticPinned);
    setLoading(true);
    try {
      const endpoint = optimisticPinned ? `/unpin/${repoId}` : `/pin/${repoId}`;
      await apiClient(endpoint, { method: "PUT" });
      router.refresh();
    } catch {
      setOptimisticPinned(previous);
      toast.error("Failed to update pin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        optimisticPinned
          ? "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20"
          : "border-glass-border bg-surface-secondary text-muted hover:bg-surface-elevated"
      }`}
    >
      <svg className="size-4" fill={optimisticPinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657l-1.414 1.414a2 2 0 01-2.828 0l-4.243-4.243a2 2 0 010-2.828l1.414-1.414a2 2 0 012.828 0l4.243 4.243a2 2 0 010 2.828z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5L21 3M15.5 8.5L11 3M15.5 8.5L18 11M15.5 8.5L8.5 15.5" />
      </svg>
      {optimisticPinned ? "Pinned" : "Pin"}
    </button>
  );
}
