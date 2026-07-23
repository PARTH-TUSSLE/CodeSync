"use client";

import type { Commit } from "@/types/models";

interface CommitGraphProps {
  commits: Commit[];
}

export function CommitGraph({ commits }: CommitGraphProps) {
  if (commits.length === 0) return null;

  return (
    <div className="py-4">
      {commits.map((commit, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === commits.length - 1;

        return (
          <div key={commit.id} className="flex items-stretch gap-3">
            <div className="flex w-6 flex-col items-center">
              {!isFirst && (
                <div className="w-0.5 flex-1 bg-glass-border" />
              )}
              <div
                className={`size-3 rounded-full border-2 shrink-0 ${
                  isFirst
                    ? "border-accent bg-accent/20"
                    : "border-glass-border bg-surface-elevated"
                }`}
              />
              {!isLast && (
                <div className="w-0.5 flex-1 bg-glass-border" />
              )}
            </div>
            <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
              <p className="text-xs font-medium text-primary line-clamp-1">{commit.message}</p>
              <p className="text-[10px] text-muted mt-0.5">
                {commit.author?.username && (
                  <span className="font-medium text-subtle">{commit.author.username}</span>
                )}
                {commit.author?.username && <span> </span>}
                <span>{timeAgo(new Date(commit.createdAt))}</span>
                {commit.filesCount !== undefined && (
                  <span> · {commit.filesCount} file{commit.filesCount !== 1 ? "s" : ""}</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
