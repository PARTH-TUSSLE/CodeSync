"use client";

import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { use } from "react";

export default function RepoSetupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const commands = [
    { label: "Initialize", cmd: `npx tsx /path/to/backend/src/cli.ts init ${id}` },
    { label: "Set Remote", cmd: `npx tsx /path/to/backend/src/cli.ts remote ${id}` },
    { label: "Add File", cmd: 'npx tsx /path/to/backend/src/cli.ts add .' },
    { label: "Commit", cmd: 'npx tsx /path/to/backend/src/cli.ts commit "Initial commit"' },
    { label: "Push", cmd: "npx tsx /path/to/backend/src/cli.ts push" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="rounded-xl border border-glass-border bg-surface-elevated p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-accent/10">
            <svg className="size-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Repository Created!</h1>
            <p className="text-sm text-muted">Push code using the CLI to get started.</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-1 text-xs font-medium text-subtle uppercase tracking-wide">Repository ID</p>
          <div className="flex items-center gap-2 rounded-lg border border-glass-border bg-glass px-3 py-2">
            <code className="flex-1 text-xs text-primary font-mono select-all">{id}</code>
            <button
              onClick={() => navigator.clipboard.writeText(id)}
              className="shrink-0 text-xs text-accent hover:text-accent-soft transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium text-subtle uppercase tracking-wide">Quick Setup</p>
          {commands.map((item) => (
            <div key={item.label} className="rounded-lg border border-glass-border bg-glass p-3">
              <p className="mb-1 text-[10px] font-medium text-subtle uppercase">{item.label}</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-primary font-mono">{item.cmd}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(item.cmd)}
                  className="shrink-0 rounded-md border border-glass-border px-2 py-1 text-[10px] text-muted hover:text-primary hover:bg-glass-hover transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button onClick={() => router.push(`/repos/${id}`)} className="btn-primary text-sm">
            Go to Repository
          </button>
        </div>
      </div>
    </div>
  );
}
