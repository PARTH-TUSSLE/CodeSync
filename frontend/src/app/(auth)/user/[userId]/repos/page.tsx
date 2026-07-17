import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { RepoCard } from "@/components/repo/RepoCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Repository } from "@/types/models";

export const metadata: Metadata = {
  title: "Repositories — CodeSync",
};

interface UserReposResponse {
  msg: string;
  userRepos: Repository[];
}

async function fetchUserRepos(
  userId: string,
  token: string,
): Promise<Repository[]> {
  try {
    const res = await fetch(apiUrl(`/repo/user/${userId}`), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: UserReposResponse = await res.json();
    return data.userRepos ?? [];
  } catch {
    return [];
  }
}

export default async function UserReposPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { userId } = await params;
  const token = (await getTokenFromCookies()) ?? "";
  const allRepos = await fetchUserRepos(userId, token);
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(allRepos.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRepos = allRepos.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">
        Repositories
      </h1>
      {paginatedRepos.length === 0 ? (
        <EmptyState
          title="No repositories yet"
          description="This user hasn't created any repositories."
        />
      ) : (
        <>
          <div className="space-y-3">
            {paginatedRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {safePage > 1 && (
                <a
                  href={`/user/${userId}/repos?page=${safePage - 1}`}
                  className="btn-ghost text-xs"
                >
                  Previous
                </a>
              )}
              <span className="text-xs text-muted">
                Page {safePage} of {totalPages}
              </span>
              {safePage < totalPages && (
                <a
                  href={`/user/${userId}/repos?page=${safePage + 1}`}
                  className="btn-ghost text-xs"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
