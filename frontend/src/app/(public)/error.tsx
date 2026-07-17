"use client";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
      <div className="glass-card mx-auto max-w-md p-8 text-center">
        <div className="mb-2 text-4xl font-bold text-gradient">Oops</div>
        <h2 className="mb-2 text-lg font-semibold text-primary">
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-muted">
          {error.message || "An unexpected error occurred"}
        </p>
        <button onClick={reset} className="btn-primary">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Try again
        </button>
      </div>
    </div>
  );
}
