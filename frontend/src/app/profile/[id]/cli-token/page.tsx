"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { TokenDisplay } from "@/components/auth/TokenDisplay";

export default function CliTokenPage() {
  const { token, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-glass-border border-t-accent" />
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 py-20">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-glass-border bg-surface-elevated">
          <svg className="size-8 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-primary">Not authenticated</h1>
          <p className="mt-1 text-sm text-muted">
            Please log in to view your CLI token.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          CLI Authentication
        </h1>
        <p className="mt-1 text-sm text-muted">
          Use this token to authenticate the CodeSync CLI on your local machine.
        </p>
      </div>

      <div className="rounded-xl border border-glass-border bg-surface-elevated p-6 sm:p-8">
        <TokenDisplay token={token} />
      </div>
    </div>
  );
}
