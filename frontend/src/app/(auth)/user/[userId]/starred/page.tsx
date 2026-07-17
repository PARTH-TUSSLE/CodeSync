import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { RepoCard } from "@/components/repo/RepoCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { BackButton } from "@/components/ui/BackButton";
import type { Repository } from "@/types/models";

export const metadata: Metadata = {
  title: "Starred Repositories — CodeSync",
};

interface StarredResponse {
  msg: string;
  starredRepos: Repository[];
}

async function fetchStarredRepos(
  userId: string,
  token: string,
): Promise<Repository[]> {
  try {
    const res = await fetch(apiUrl(`/starred/${userId}`), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: StarredResponse = await res.json();
    return data.starredRepos ?? [];
  } catch {
    return [];
  }
}

export default async function StarredReposPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const token = (await getTokenFromCookies()) ?? "";
  const repos = await fetchStarredRepos(userId, token);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <BackButton />
      </div>
      <h1 className="mb-6 text-2xl font-bold text-primary">
        Starred Repositories
      </h1>
      {repos.length === 0 ? (
        <EmptyState
          title="No starred repositories"
          description="Star repositories you find interesting to see them here."
        />
      ) : (
        <div className="space-y-3">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
