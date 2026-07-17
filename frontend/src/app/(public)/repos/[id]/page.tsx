import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { StarButton } from "@/components/repo/StarButton";
import { PinButton } from "@/components/repo/PinButton";
import { VisibilityBadge } from "@/components/repo/VisibilityBadge";
import { DeleteRepoButton } from "@/components/repo/DeleteRepoButton";
import { IssueCountBadges } from "@/components/repo/IssueCountBadges";
import type { Repository } from "@/types/models";

interface RepoResponse {
  msg: string;
  repo: Repository;
}

interface ProfileResponse {
  msg: string;
  user: {
    id: string;
    starredRepos?: string[];
    pinnedRepos?: string[];
  };
}

async function fetchRepo(
  id: string,
  token?: string,
): Promise<Repository | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(apiUrl(`/repo/${id}`), {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: RepoResponse = await res.json();
    return data.repo;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const token = await getTokenFromCookies();
  const repo = await fetchRepo(id, token);
  return {
    title: repo ? `${repo.name} — CodeSync` : "Repository not found — CodeSync",
  };
}

export default async function RepoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getTokenFromCookies();
  const repo = await fetchRepo(id, token);

  if (!repo) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
        <h1 className="text-2xl font-bold text-subtle">
          Repository not found
        </h1>
        <p className="text-muted">
          The repository you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    );
  }

  let isStarred = false;
  let isPinned = false;
  let currentUserId: string | null = null;
  if (token) {
    const profileRes = await fetch(apiUrl(`/userProfile/${repo.ownerId}`), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (profileRes.ok) {
      const profileData: ProfileResponse = await profileRes.json();
      const user = profileData.user;
      isStarred = user.starredRepos?.includes(id) ?? false;
      isPinned = user.pinnedRepos?.includes(id) ?? false;
      currentUserId = user.id;
    }
  }

  const isOwner = currentUserId === repo.ownerId;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {repo.name}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted">
              {repo.owner ? (
                <span>
                  by{" "}
                  <a
                    href={`/profile/${repo.owner.id}`}
                    className="font-medium text-primary hover:text-accent transition-colors"
                  >
                    {repo.owner.username}
                  </a>
                </span>
              ) : (
                <span>by {repo.ownerId}</span>
              )}
              <VisibilityBadge isPublic={repo.visibility} />
              <span>
                Created {new Date(repo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StarButton repoId={id} isStarred={isStarred} />
            <PinButton repoId={id} isPinned={isPinned} />
          </div>
        </div>
      </div>

      {repo.description && (
        <div className="mb-8 rounded-xl border border-glass-border bg-glass p-5">
          <p className="text-sm text-primary">
            {repo.description}
          </p>
        </div>
      )}

      <div className="mb-8">
        <IssueCountBadges repoId={id} />
      </div>

      {isOwner && (
        <div className="mb-8">
          <DeleteRepoButton repoId={id} repoName={repo.name} />
        </div>
      )}
    </div>
  );
}
