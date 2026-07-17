import Link from "next/link";
import type { Repository } from "@/types/models";
import { VisibilityBadge } from "@/components/repo/VisibilityBadge";

interface RepoCardProps {
  repo: Repository;
}

export function RepoCard({ repo }: RepoCardProps) {
  const description =
    repo.description && repo.description.length > 120
      ? repo.description.slice(0, 120) + "..."
      : repo.description;

  return (
    <div className="glass-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/repos/${repo.id}`}
            className="text-lg font-semibold text-primary hover:text-accent"
          >
            {repo.name}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted">
            {repo.owner ? (
              <Link
                href={`/profile/${repo.owner.id}`}
                className="hover:text-accent"
              >
                {repo.owner.username}
              </Link>
            ) : (
              <span>{repo.ownerId}</span>
            )}
            <VisibilityBadge isPublic={repo.visibility} />
          </div>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-sm text-muted line-clamp-2">
          {description}
        </p>
      )}
      <div className="mt-3 flex items-center gap-4 text-xs text-subtle">
        <span>Created {new Date(repo.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
