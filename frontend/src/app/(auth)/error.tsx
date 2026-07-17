"use client";

export default function AuthError({
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
          Try again
        </button>
      </div>
    </div>
  );
}
