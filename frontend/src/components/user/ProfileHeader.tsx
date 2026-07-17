"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import type { User } from "@/types/models";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  repoCount?: number;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function ProfileHeader({ user, isOwnProfile, repoCount }: ProfileHeaderProps) {
  const bioText = Array.isArray(user.bio) ? user.bio.join("\n") : (user.bio ?? "");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-glass-border bg-gradient-to-br from-surface-elevated via-surface-elevated to-accent-glow/5 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-accent/3 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <Avatar
            src={user.profilePic}
            username={user.username}
            size="xxl"
          />

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              {user.username}
            </h1>
            {user.email && (
              <p className="mt-0.5 text-sm text-muted">
                {user.email}
              </p>
            )}

            {bioText && (
              <p className="mt-3 max-w-lg whitespace-pre-wrap text-sm leading-relaxed text-primary/80">
                {bioText}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              {user.createdAt && (
                <span className="inline-flex items-center gap-1.5">
                  <svg className="size-3.5 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  Joined {formatDate(user.createdAt)}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href={`/user/${user.id}/repos`}
                className="group flex items-center gap-1.5 text-sm transition-colors hover:text-accent"
              >
                <span className="font-semibold text-primary transition-colors group-hover:text-accent">
                  {repoCount ?? 0}
                </span>
                <span className="text-muted">repositories</span>
              </Link>
              <span className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-primary">
                  {user.followers?.length ?? 0}
                </span>
                <span className="text-muted">followers</span>
              </span>
              <span className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-primary">
                  {user.following?.length ?? 0}
                </span>
                <span className="text-muted">following</span>
              </span>
              <Link
                href={`/user/${user.id}/starred`}
                className="group flex items-center gap-1.5 text-sm transition-colors hover:text-accent"
              >
                <span className="font-semibold text-primary transition-colors group-hover:text-accent">
                  {user.starredRepos?.length ?? 0}
                </span>
                <span className="text-muted">stars</span>
              </Link>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <div className="flex shrink-0 items-start gap-2">
            <Link
              href={`/profile/${user.id}/edit`}
              className="btn-secondary !rounded-xl !px-4 !py-2 text-sm"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Edit Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
