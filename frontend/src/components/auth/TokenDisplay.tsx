"use client";

import { useState } from "react";

interface TokenDisplayProps {
  token: string;
}

export function TokenDisplay({ token }: TokenDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = token;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayToken = revealed
    ? token
    : `${token.slice(0, 20)}...${token.slice(-8)}`;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent-glow p-4">
        <svg className="mt-0.5 size-5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
        <div className="text-sm text-primary/80">
          <p className="font-medium text-primary">Keep this token secure</p>
          <p className="mt-0.5 text-muted">
            This token grants full access to your account. Never share it or commit it to version control.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-primary">
          Your Authentication Token
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              readOnly
              value={displayToken}
              type={revealed ? "text" : "password"}
              className="glass-input w-full px-3.5 py-2.5 pr-10 text-sm font-mono"
            />
            <button
              type="button"
              onClick={() => setRevealed(!revealed)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition-colors hover:text-primary"
              aria-label={revealed ? "Hide token" : "Reveal token"}
            >
              {revealed ? (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="btn-primary !rounded-xl !px-5 !py-2.5 text-sm"
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                Copy
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-glass-border bg-surface p-4">
        <p className="mb-2 text-sm font-medium text-primary">Quick Setup</p>
        <p className="mb-3 text-xs text-muted">
          Run this command in your terminal to authenticate the CLI:
        </p>
        <div className="flex items-center gap-2 rounded-lg bg-surface-tertiary px-4 py-2.5">
          <code className="flex-1 text-xs font-mono text-primary">
            codesync login {token.slice(0, 16)}...
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 text-xs font-medium text-accent hover:text-accent-soft transition-colors"
          >
            Copy full command
          </button>
        </div>
      </div>
    </div>
  );
}
