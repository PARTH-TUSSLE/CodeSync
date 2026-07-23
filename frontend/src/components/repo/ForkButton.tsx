"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

interface ForkButtonProps {
  repoId: string;
}

export function ForkButton({ repoId }: ForkButtonProps) {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleFork = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      interface ForkResponse {
        msg: string;
        fork: { id: string };
      }
      const data = await apiClient<ForkResponse>(`/repo/${repoId}/forks`, {
        method: "POST",
      });
      toast.success("Repository forked!");
      router.push(`/repos/${data.fork.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fork";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFork}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-lg border border-glass-border px-3 py-1.5 text-xs text-muted hover:text-primary hover:bg-glass-hover transition-colors"
      title="Fork this repository"
    >
      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20a2 2 0 100-4 2 2 0 000 4zM10 4a2 2 0 100-4 2 2 0 000 4zM18 14a2 2 0 100-4 2 2 0 000 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6v4a4 4 0 004 4h4" />
      </svg>
      {loading ? "Forking..." : "Fork"}
    </button>
  );
}
