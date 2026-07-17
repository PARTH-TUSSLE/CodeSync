import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-glass-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="font-bold text-primary">
            Code<span className="text-accent">Sync</span>
          </span>
          <span className="text-subtle">&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted">
          <Link href="/repos" className="transition-colors hover:text-primary">
            Explore
          </Link>
          <Link href="/login" className="transition-colors hover:text-primary">
            Sign In
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
