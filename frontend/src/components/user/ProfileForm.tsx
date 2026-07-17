"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";

interface ProfileFormProps {
  userId: string;
  initialUsername: string;
  initialBio: string;
  initialProfilePic: string | null;
}

export function ProfileForm({
  userId,
  initialUsername,
  initialBio,
  initialProfilePic,
}: ProfileFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [profilePic, setProfilePic] = useState(initialProfilePic ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setProfilePic(dataUri);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    setLoading(true);
    try {
      await apiClient(`/updateProfile/${userId}`, {
        method: "PUT",
        body: {
          username: username.trim(),
          bio: bio.trim() || undefined,
          profilePic: profilePic || undefined,
        },
      });
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <div className="relative">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile picture preview"
                className="size-24 rounded-full border-2 border-glass-border object-cover ring-2 ring-glass-border ring-offset-2 ring-offset-surface-elevated"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-surface-tertiary to-surface-elevated text-3xl font-semibold text-primary ring-2 ring-glass-border ring-offset-2 ring-offset-surface-elevated">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <label
              htmlFor="profilePic"
              className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full border border-glass-border bg-surface-elevated text-muted shadow-sm transition-colors hover:bg-surface-hover hover:text-primary"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
              </svg>
            </label>
          </div>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {profilePic && (
            <button
              type="button"
              onClick={() => setProfilePic("")}
              className="text-xs text-muted hover:text-warm transition-colors"
            >
              Remove photo
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-primary"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 text-sm"
              required
              minLength={3}
              maxLength={50}
              placeholder="your_username"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="mb-1.5 block text-sm font-medium text-primary"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={200}
              className="glass-input w-full resize-none px-3.5 py-2.5 text-sm"
              placeholder="Tell the world about yourself..."
            />
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-xs text-subtle">
                Your bio will be displayed on your public profile.
              </p>
              <span className={`text-xs tabular-nums ${
                bio.length >= 180 ? "text-warm" : "text-subtle"
              }`}>
                {bio.length}/200
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-warm/20 bg-warm/5 px-4 py-3 text-sm text-warm">
          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-glass-border pt-5">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary !rounded-xl !px-6 !py-2.5 text-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="size-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black/80" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost !rounded-xl text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
