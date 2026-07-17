export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-glass-border bg-surface-elevated p-6 sm:p-8">
        <div className="flex animate-pulse flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <div className="mx-auto size-28 shrink-0 rounded-full bg-surface-tertiary sm:mx-0" />
          <div className="min-w-0 flex-1 space-y-4">
            <div className="h-8 w-48 rounded-lg bg-surface-tertiary" />
            <div className="h-4 w-64 rounded-lg bg-surface-tertiary" />
            <div className="h-4 w-96 rounded-lg bg-surface-tertiary" />
            <div className="mt-4 flex gap-6">
              <div className="h-4 w-20 rounded-lg bg-surface-tertiary" />
              <div className="h-4 w-20 rounded-lg bg-surface-tertiary" />
              <div className="h-4 w-20 rounded-lg bg-surface-tertiary" />
              <div className="h-4 w-20 rounded-lg bg-surface-tertiary" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-glass-border bg-surface-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-surface-tertiary" />
              <div className="space-y-2">
                <div className="h-6 w-12 rounded bg-surface-tertiary" />
                <div className="h-3 w-16 rounded bg-surface-tertiary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="animate-pulse rounded-xl border border-glass-border bg-surface-elevated p-5 sm:p-6">
        <div className="mb-5 h-4 w-32 rounded bg-surface-tertiary" />
        <div className="flex gap-1">
          {Array.from({ length: 53 }).map((_, i) => (
            <div key={i} className="space-y-1">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="size-3 rounded-sm bg-surface-tertiary" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
