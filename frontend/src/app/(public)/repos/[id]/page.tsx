import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { RepoTabs } from "@/components/repo/RepoTabs";
import { RepoCodeView } from "./RepoCodeView";
import { BackButton } from "@/components/ui/BackButton";
import type { Repository, Branch } from "@/types/models";

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

interface BranchesResponse {
  msg: string;
  defaultBranch: string;
  branches: Branch[];
}

async function fetchRepo(id: string, token?: string): Promise<Repository | null> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(apiUrl(`/repo/${id}`), { headers, cache: "no-store" });
    if (!res.ok) return null;
    const data: RepoResponse = await res.json();
    return data.repo;
  } catch {
    return null;
  }
}

async function fetchBranches(repoId: string): Promise<BranchesResponse | null> {
  try {
    const res = await fetch(apiUrl(`/repo/${repoId}/branches`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
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
  const [repo, branchesData] = await Promise.all([
    fetchRepo(id, token),
    fetchBranches(id),
  ]);

  if (!repo) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
        <h1 className="text-2xl font-bold text-subtle">Repository not found</h1>
        <p className="text-muted">The repository you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  let isStarred = false;
  let isPinned = false;
  let currentUserId: string | null = null;
  if (token) {
    const profileRes = await fetch(apiUrl(`/userProfile/${repo.ownerId}`), {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
  const defaultBranch = branchesData?.defaultBranch || repo.defaultBranch || "main";
  const { StarButton } = await import("@/components/repo/StarButton");
  const { PinButton } = await import("@/components/repo/PinButton");
  const { VisibilityBadge } = await import("@/components/repo/VisibilityBadge");
  const { DeleteRepoButton } = await import("@/components/repo/DeleteRepoButton");
  const { IssueCountBadges } = await import("@/components/repo/IssueCountBadges");

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary">{repo.name}</h1>
            <VisibilityBadge isPublic={repo.visibility} />
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted">
            {repo.owner && (
              <a
                href={`/profile/${repo.owner.id}`}
                className="font-medium text-primary hover:text-accent transition-colors"
              >
                {repo.owner.username}
              </a>
            )}
            <span>Created {new Date(repo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StarButton repoId={id} isStarred={isStarred} />
          <PinButton repoId={id} isPinned={isPinned} />
        </div>
      </div>

      {repo.description && (
        <div className="mb-4 rounded-xl border border-glass-border bg-glass p-4">
          <p className="text-sm text-primary">{repo.description}</p>
        </div>
      )}

      <RepoTabs repoId={id} />

      <RepoCodeView
        repoId={id}
        defaultBranch={defaultBranch}
        isOwner={isOwner}
        repoName={repo.name}
      />

      <div className="mt-6">
        <IssueCountBadges repoId={id} />
      </div>

      {isOwner && (
        <div className="mt-4">
          <DeleteRepoButton repoId={id} repoName={repo.name} />
        </div>
      )}
    </div>
  );
}
