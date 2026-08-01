"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { ApiError } from "@/types/models";

function AuthorizeForm() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [status, setStatus] = useState<"idle" | "confirming" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const handleConnect = async () => {
    const userCode = code.trim().toUpperCase();
    if (!userCode) {
      setStatus("error");
      setMessage("Please enter the code shown in your terminal.");
      return;
    }

    setStatus("confirming");
    setMessage("");

    try {
      await apiClient<{ msg: string }>("/auth/device/confirm", {
        method: "POST",
        body: { userCode },
      });
      setStatus("success");
      setMessage("Device authorized. You can return to your terminal.");
    } catch (err) {
      const body = err as { body?: ApiError; message?: string };
      setStatus("error");
      setMessage(
        body?.body?.msg || body?.message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="mb-2 text-center">
            <span className="font-mono text-xs text-accent">~/cli-authorize</span>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-primary">
            Authorize CLI Device
          </h1>
          <p className="mb-6 text-center text-sm text-muted">
            A CodeSync CLI on your machine wants to connect to your account.
          </p>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="size-6 animate-spin rounded-full border-2 border-glass-border border-t-accent" />
            </div>
          ) : !isAuthenticated || !user ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-glass-border bg-surface-secondary p-4 text-center text-sm text-muted">
                You need to be signed in to authorize a device.
              </div>
              <Link
                href="/login"
                className="btn-primary flex w-full items-center justify-center !rounded-xl !py-2.5 text-sm"
              >
                Sign in
              </Link>
            </div>
          ) : status === "success" ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-emerald/30 bg-emerald/10 p-4">
                <svg className="mt-0.5 size-5 shrink-0 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-primary">Device authorized!</p>
                  <p className="mt-0.5 text-muted">
                    Return to your terminal. Your CLI should now be logged in.
                  </p>
                </div>
              </div>
              <Link
                href={`/profile/${user.id}/cli-token`}
                className="flex w-full items-center justify-center !rounded-xl !py-2.5 text-sm font-medium text-accent transition-colors hover:text-accent-soft"
              >
                Go to CLI settings
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-primary">
                  Authorizing as
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-glass-border bg-surface-elevated px-4 py-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                    {user.username.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">
                      {user.username}
                    </p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-primary">
                  Pairing code
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="glass-input w-full px-3.5 py-2.5 text-center font-mono text-sm tracking-[0.3em]"
                />
                <p className="mt-1.5 text-xs text-muted">
                  Enter the code shown in your terminal, then connect this device.
                </p>
              </div>

              {status === "error" && (
                <div className="rounded-lg border border-warm/30 bg-warm/10 p-3 text-sm text-warm">
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={handleConnect}
                disabled={status === "confirming"}
                className="btn-primary flex w-full items-center justify-center !rounded-xl !py-2.5 text-sm"
              >
                {status === "confirming" ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Connecting...
                  </span>
                ) : (
                  "Connect this device"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CliAuthorizePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="size-6 animate-spin rounded-full border-2 border-glass-border border-t-accent" />
        </div>
      }
    >
      <AuthorizeForm />
    </Suspense>
  );
}
