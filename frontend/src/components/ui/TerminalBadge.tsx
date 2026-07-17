export function TerminalBadge({ className }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[rgba(0,229,255,0.12)] bg-[rgba(0,229,255,0.06)] px-3 py-1 text-xs font-medium text-accent ${className ?? ""}`}
    >
      <span className="flex size-1.5 rounded-full bg-emerald-400 animate-glow-pulse-fast" />
      <span className="font-mono">~/codesync</span>
    </div>
  );
}
