"use client";

import { useState, useEffect, useTransition } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiClient } from "@/lib/api/client";
import { ContributionGrid } from "@/components/user/ContributionGrid";
import { YearPicker } from "@/components/user/YearPicker";
import type { Contribution } from "@/types/models";

interface ContributionsResponse {
  contributions: Contribution[];
  totalContributions: number;
  year: number;
}

export default function ContributionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear(),
  );
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { token } = useAuth();

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await apiClient<ContributionsResponse>(
          `/contributions/${id}?year=${selectedYear}`,
          { token },
        );
        if (!cancelled) {
          startTransition(() => {
            setData(result);
            setError("");
          });
        }
      } catch (err) {
        if (!cancelled) {
          startTransition(() => {
            setError(
              err instanceof Error
                ? err.message
                : "Failed to load contributions",
            );
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, selectedYear, token, startTransition]);

  if (!id) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Contributions
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your contribution activity throughout the year.
        </p>
      </div>

      <div className="rounded-xl border border-glass-border bg-surface-elevated p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <svg className="size-5 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            <h2 className="text-lg font-semibold text-primary">
              Contribution Activity
            </h2>
          </div>
          <YearPicker
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-warm/20 bg-warm/5 px-4 py-3 text-sm text-warm">
            <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        {data ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="text-2xl font-bold text-primary">
                {data.totalContributions.toLocaleString()}
              </span>
              contribution{data.totalContributions !== 1 ? "s" : ""} in {data.year}
            </div>
            <div className="overflow-x-auto pb-2">
              <ContributionGrid
                contributions={data.contributions}
                year={data.year}
              />
            </div>
          </div>
        ) : (
          !error && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="size-6 animate-spin rounded-full border-2 border-glass-border border-t-accent" />
                <p className="text-sm text-subtle">
                  {isPending ? "Loading..." : "Loading contributions..."}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
