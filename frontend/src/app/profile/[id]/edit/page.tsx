import type { Metadata } from "next";
import { getTokenFromCookies } from "@/lib/auth/cookies";
import { apiUrl } from "@/lib/api/urls";
import { ProfileForm } from "@/components/user/ProfileForm";
import type { User } from "@/types/models";

export const metadata: Metadata = {
  title: "Edit Profile — CodeSync",
};

interface ProfileResponse {
  msg: string;
  user: User;
}

async function fetchProfile(
  id: string,
  token: string,
): Promise<User | null> {
  try {
    const res = await fetch(apiUrl(`/userProfile/${id}`), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: ProfileResponse = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = (await getTokenFromCookies()) ?? "";
  const user = await fetchProfile(id, token);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-glass-border bg-surface-elevated">
          <svg className="size-8 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-primary">User not found</h1>
      </div>
    );
  }

  const bioText = Array.isArray(user.bio) ? user.bio.join("\n") : (user.bio ?? "");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Edit Profile
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update your public profile information and avatar.
        </p>
      </div>

      <div className="rounded-xl border border-glass-border bg-surface-elevated p-6 sm:p-8">
        <ProfileForm
          userId={id}
          initialUsername={user.username}
          initialBio={bioText}
          initialProfilePic={user.profilePic}
        />
      </div>
    </div>
  );
}
