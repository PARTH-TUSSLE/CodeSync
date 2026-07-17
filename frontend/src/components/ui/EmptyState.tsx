import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string | null;
  actionLabel?: string | null;
  actionHref?: string | null;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-glass-border bg-surface px-6 py-12">
      {icon && <div className="mb-4 text-subtle">{icon}</div>}
      <h3 className="text-lg font-medium text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-muted">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="btn-primary mt-4 px-4 py-2 text-sm"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
