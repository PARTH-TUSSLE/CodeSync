import { cn } from "@/lib/cn";

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "text" | "heatmap";
  count?: number;
  className?: string;
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-surface-elevated",
        className,
      )}
    />
  );
}

export function LoadingSkeleton({
  variant = "text",
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === "card") {
    return (
      <div className={cn("space-y-4", className)}>
        {items.map((_, i) => (
          <div key={i} className="glass-card p-4">
            <SkeletonBlock className="mb-2 h-5 w-3/4" />
            <SkeletonBlock className="mb-1 h-4 w-1/2" />
            <SkeletonBlock className="h-3 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonBlock className="size-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "heatmap") {
    return (
      <div className={cn("space-y-1", className)}>
        {items.map((_, i) => (
          <div key={i} className="flex gap-1">
            {Array.from({ length: 53 }).map((_, j) => (
              <SkeletonBlock key={j} className="size-3 rounded-sm" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((_, i) => (
        <SkeletonBlock key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
