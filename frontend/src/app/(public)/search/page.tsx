import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { RepoCard } from "@/components/repo/RepoCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Repository } from "@/types/models";

export const metadata: Metadata = {
  title: "Search — CodeSync",
};

interface SearchResponse {
  msg: string;
  repos: Repository[];
}

async function searchRepos(
  name: string,
  token?: string,
): Promise<Repository[]> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(apiUrl(`/repo/name/${encodeURIComponent(name)}`), {
      headers,
      cache: "no-store",
    });
    if (res.status === 404) return [];
    if (!res.ok) return [];
    const data: SearchResponse = await res.json();
    return data.repos ?? [];
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const token = await getTokenFromCookies();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const repos = query ? await searchRepos(query, token) : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-2 text-2xl font-bold text-primary">
        Search Results
      </h1>
      {query && (
        <p className="mb-6 text-sm text-muted">
          {repos.length === 0
            ? `No results for "${query}"`
            : `Found ${repos.length} result${repos.length === 1 ? "" : "s"} for "${query}"`}
        </p>
      )}
      {!query ? (
        <EmptyState
          title="Search for repositories"
          description="Use the search bar in the navigation to find repositories."
        />
      ) : repos.length === 0 ? (
        <EmptyState
          title="No repositories found"
          description={`We couldn't find any repositories matching "${query}".`}
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
