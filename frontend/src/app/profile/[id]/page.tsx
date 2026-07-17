import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { ProfileView } from "@/components/user/ProfileView";
import type { User, Repository } from "@/types/models";

export const metadata: Metadata = {
  title: "Profile — CodeSync",
};

interface ProfileResponse {
  msg: string;
  user: User;
}

interface PinnedResponse {
  msg: string;
  pinnedRepos: Repository[];
}

async function fetchProfile(
  id: string,
  token?: string,
): Promise<User | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(apiUrl(`/userProfile/${id}`), {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: ProfileResponse = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

async function fetchPinnedRepos(
  userId: string,
  token?: string,
): Promise<Repository[]> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(apiUrl(`/pinned/${userId}`), {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: PinnedResponse = await res.json();
    return data.pinnedRepos ?? [];
  } catch {
    return [];
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getTokenFromCookies();
  const [user, pinnedRepos] = await Promise.all([
    fetchProfile(id, token),
    fetchPinnedRepos(id, token),
  ]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-glass-border bg-surface-elevated">
          <svg className="size-8 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-primary">User not found</h1>
          <p className="mt-1 text-sm text-muted">
            The user you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return <ProfileView user={user} pinnedRepos={pinnedRepos} />;
}
