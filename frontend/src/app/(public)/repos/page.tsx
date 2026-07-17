import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { RepoCard } from "@/components/repo/RepoCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Repository } from "@/types/models";

export const metadata: Metadata = {
  title: "Explore Repositories — CodeSync",
};

interface AllReposResponse {
  msg: string;
  repos: Repository[];
}

async function fetchAllRepos(token?: string): Promise<Repository[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(apiUrl("/allRepos"), {
      headers: { "Content-Type": "application/json", ...headers },
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Failed to fetch repos:", res.status, text);
      return [];
    }
    const data: AllReposResponse = await res.json();
    return data.repos ?? [];
  } catch (err) {
    console.error("Failed to fetch repos:", err);
    return [];
  }
}

export default async function ExploreReposPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const token = await getTokenFromCookies();
  const allRepos = await fetchAllRepos(token);
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
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
        Explore Repositories
      </h1>
      {paginatedRepos.length === 0 ? (
        <EmptyState
          title="No repositories found"
          description="Be the first to create one!"
          actionLabel="Create Repo"
          actionHref="/repos/new"
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
                  href={`/repos?page=${safePage - 1}`}
                  className="btn-ghost text-xs"
                  aria-label="Previous page"
                >
                  Previous
                </a>
              )}
              <span className="text-xs text-muted" role="status" aria-label={`Page ${safePage} of ${totalPages}`}>
                Page {safePage} of {totalPages}
              </span>
              {safePage < totalPages && (
                <a
                  href={`/repos?page=${safePage + 1}`}
                  className="btn-ghost text-xs"
                  aria-label="Next page"
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
