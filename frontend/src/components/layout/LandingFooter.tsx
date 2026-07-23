import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-glass-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-[-0.03em] text-primary">
            Code<span className="text-accent">Sync</span>
          </span>
          <span className="text-xs text-subtle/60">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-8">
          {[
            { label: "Docs", href: "/docs" },
            { label: "Explore", href: "/repos" },
            { label: "Sign In", href: "/login" },
            { label: "GitHub", href: "https://github.com", external: true },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm font-medium text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
