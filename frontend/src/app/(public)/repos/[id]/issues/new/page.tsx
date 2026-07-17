"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { IssueForm } from "@/components/issue/IssueForm";

export default function CreateIssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [repoId, setRepoId] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setRepoId(p.id));
  }, [params]);

  if (!repoId) return null;

  if (!isAuthenticated || !user) {
    router.push(`/login?redirect=/repos/${repoId}/issues/new`);
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">
        New Issue
      </h1>
      <IssueForm
        repoId={repoId}
        mode="create"
        onSuccess={(issueId) => {
          router.push(`/repos/${repoId}/issues/${issueId}`);
        }}
        onCancel={() => {
          router.push(`/repos/${repoId}/issues`);
        }}
      />
    </div>
  );
}
