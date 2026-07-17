"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";

interface ChangePasswordFormProps {
  userId: string;
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword === oldPassword) {
      setError("New password must be different from current password");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await apiClient(`/changePassword/${userId}`, {
        method: "PUT",
        body: {
          oldPassword,
          newPassword,
          confirmNewPassword,
        },
      });
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to change password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="relative">
          <label
            htmlFor="oldPassword"
            className="mb-1.5 block text-sm font-medium text-primary"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 pl-10 text-sm"
              required
              minLength={6}
              placeholder="Enter current password"
            />
            <svg className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <label
            htmlFor="newPassword"
            className="mb-1.5 block text-sm font-medium text-primary"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 pl-10 text-sm"
              required
              minLength={6}
              placeholder="Enter new password"
            />
            <svg className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <label
            htmlFor="confirmNewPassword"
            className="mb-1.5 block text-sm font-medium text-primary"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 pl-10 text-sm"
              required
              minLength={6}
              placeholder="Confirm new password"
            />
            <svg className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
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
              Changing...
            </span>
          ) : (
            "Change Password"
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
          }}
          className="btn-ghost !rounded-xl text-sm"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
