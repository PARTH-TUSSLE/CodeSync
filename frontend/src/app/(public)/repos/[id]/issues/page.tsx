import type { Metadata } from "next";
import { apiUrl } from "@/lib/api/urls";
import { IssueCard } from "@/components/issue/IssueCard";
import { IssueStatusFilter } from "@/components/issue/IssueStatusFilter";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Issue } from "@/types/models";

export const metadata: Metadata = {
  title: "Issues — CodeSync",
};

interface IssuesResponse {
  msg: string;
  issues: Issue[];
}

async function fetchIssues(repoId: string): Promise<Issue[]> {
  try {
    const res = await fetch(apiUrl(`/allIssues/${repoId}`), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.status === 404) return [];
    if (!res.ok) return [];
    const data: IssuesResponse = await res.json();
    return data.issues ?? [];
  } catch {
    return [];
  }
}

export default async function IssueListPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const allIssues = await fetchIssues(id);
  const activeFilter = sp.status ?? "all";

  const filteredIssues =
    activeFilter === "all"
      ? allIssues
      : allIssues.filter((i) => i.status === activeFilter);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          Issues
        </h1>
        <a
          href={`/repos/${id}/issues/new`}
          className="btn-primary !py-2 !px-4 text-xs"
        >
          New Issue
        </a>
      </div>

      <div className="mb-4">
        <IssueStatusFilter
          repoId={id}
          current={activeFilter}
          openCount={allIssues.filter((i) => i.status === "open").length}
          closedCount={allIssues.filter((i) => i.status === "closed").length}
        />
      </div>

      {filteredIssues.length === 0 ? (
        <EmptyState
          title={
            activeFilter === "all"
              ? "No issues yet"
              : activeFilter === "open"
                ? "No open issues"
                : "No closed issues"
          }
          description={
            activeFilter === "all"
              ? "Create the first issue for this repository."
              : "No issues match the current filter."
          }
          actionLabel={activeFilter === "all" ? "Create Issue" : undefined}
          actionHref={activeFilter === "all" ? `/repos/${id}/issues/new` : undefined}
        />
      ) : (
        <div className="space-y-2">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} repoId={id} />
          ))}
        </div>
      )}
    </div>
  );
}
