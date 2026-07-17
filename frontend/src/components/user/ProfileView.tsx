"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiClient } from "@/lib/api/client";
import { ProfileHeader } from "@/components/user/ProfileHeader";
import { StatsGrid } from "@/components/user/StatsGrid";
import { PinnedReposGrid } from "@/components/user/PinnedReposGrid";
import { ContributionGrid } from "@/components/user/ContributionGrid";
import { YearPicker } from "@/components/user/YearPicker";
import type { User, Repository, Contribution } from "@/types/models";

interface ProfileViewProps {
  user: User;
  pinnedRepos: Repository[];
}

interface ContributionsResponse {
  contributions: Contribution[];
  totalContributions: number;
  year: number;
}

function ContributionsSection({ userId, token }: { userId: string; token: string | null }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await apiClient<ContributionsResponse>(
          `/contributions/${userId}?year=${selectedYear}`,
          { token },
        );
        if (!cancelled) {
          setData(result);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load contributions");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [userId, selectedYear, token]);

  return (
    <section className="rounded-xl border border-glass-border bg-surface-elevated p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <svg className="size-4 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Contributions
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {data && (
            <span className="text-xs text-muted">
              {data.totalContributions} contribution{data.totalContributions !== 1 ? "s" : ""}
            </span>
          )}
          <YearPicker
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
      </div>
      {error && (
        <p className="mb-3 text-xs text-warm">{error}</p>
      )}
      {data ? (
        <div className="overflow-x-auto pb-2">
          <ContributionGrid
            contributions={data.contributions}
            year={data.year}
          />
        </div>
      ) : (
        !error && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="size-4 animate-spin rounded-full border-2 border-glass-border border-t-accent" />
              <p className="text-xs text-subtle">Loading contributions...</p>
            </div>
          </div>
        )
      )}
    </section>
  );
}

function QuickLinks({ userId }: { userId: string }) {
  const links = [
    {
      href: `/user/${userId}/repos`,
      label: "My Repositories",
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
        </svg>
      ),
    },
    {
      href: `/user/${userId}/starred`,
      label: "Starred Repositories",
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ),
    },
    {
      href: `/profile/${userId}/contributions`,
      label: "All Contributions",
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
    },
  ];

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <svg className="size-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Quick Links
        </h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-3 rounded-xl border border-glass-border bg-surface-elevated px-4 py-3 transition-all duration-200 hover:border-glass-border-hover hover:shadow-sm"
          >
            <span className="text-subtle transition-colors group-hover:text-accent">
              {link.icon}
            </span>
            <span className="text-sm font-medium text-primary transition-colors group-hover:text-accent">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ProfileView({ user, pinnedRepos }: ProfileViewProps) {
  const { user: currentUser, token } = useAuth();
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
      />

      <StatsGrid user={user} />

      <ContributionsSection
        userId={user.id}
        token={token}
      />

      <PinnedReposGrid repos={pinnedRepos} />

      <QuickLinks userId={user.id} />
    </div>
  );
}
