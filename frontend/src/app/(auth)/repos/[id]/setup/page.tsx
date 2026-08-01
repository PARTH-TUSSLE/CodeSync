"use client";

import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { use, useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="shrink-0 rounded-md border border-glass-border px-2 py-1 text-[10px] text-muted hover:text-primary hover:bg-glass-hover transition-colors min-w-[44px] text-center"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function RepoSetupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const commands = [
    { label: "Install CLI", cmd: "cd /path/to/CodeSync/backend && npm run build && npm install -g ." },
    { label: "Login", cmd: `codesync login --api-url http://localhost:8000` },
    { label: "Init", cmd: `codesync init ${id}` },
    { label: "Stage All", cmd: "codesync add ." },
    { label: "Commit", cmd: 'codesync commit "Initial commit"' },
    { label: "Push", cmd: "codesync push" },
  ];

  const fullScript = `# 1. Install the CLI globally (one time)
cd /path/to/CodeSync/backend
npm run build && npm install -g .

# 2. Login (one time — your browser opens, click "Connect this device")
codesync login --api-url http://localhost:8000

# 3. In your project directory
cd /path/to/your/project
codesync init ${id}

# 4. Create files, then push
codesync add .
codesync commit "Initial commit"
codesync push`;

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
            <CopyButton text={id} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium text-subtle uppercase tracking-wide">Quick Setup</p>
          {commands.map((item) => (
            <div key={item.label} className="rounded-lg border border-glass-border bg-glass p-3">
              <p className="mb-1 text-[10px] font-medium text-subtle uppercase">{item.label}</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-primary font-mono">{item.cmd}</code>
                <CopyButton text={item.cmd} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-subtle uppercase tracking-wide">Full Script</p>
          <div className="relative rounded-lg border border-glass-border bg-glass p-3">
            <pre className="overflow-x-auto text-[11px] text-primary font-mono leading-relaxed whitespace-pre-wrap">
              {fullScript}
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={fullScript} />
            </div>
          </div>
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
