"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Issue } from "@/types/models";
import { IssueForm } from "@/components/issue/IssueForm";
import { useAuth } from "@/lib/auth/AuthContext";

interface EditIssueButtonProps {
  repoId: string;
  issue: Issue;
}

export function EditIssueButton({ repoId, issue }: EditIssueButtonProps) {
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const isAuthor = user?.id === issue.authorId;
  if (!isAuthor) return null;

  if (editing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-lg glass-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-primary">
            Edit Issue
          </h2>
          <IssueForm
            repoId={repoId}
            initialTitle={issue.title}
            initialDescription={issue.description}
            mode="edit"
            issueId={issue.id}
            onSuccess={() => {
              setEditing(false);
              router.refresh();
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="btn-ghost px-3 py-2 text-sm"
    >
      Edit
    </button>
  );
}
