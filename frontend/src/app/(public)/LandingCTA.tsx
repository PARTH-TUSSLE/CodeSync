import Link from "next/link";

export function LandingCTA() {
  return (
    <section className="relative z-10 border-t border-glass-border bg-surface py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(0,229,255,0.04)_0%,transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="section-badge">Get Started</div>
        <h2 className="section-title mb-4">
          Ready to{" "}
          <span className="text-gradient">sync your code?</span>
        </h2>
        <p className="section-subtitle mb-10">
          Join thousands of developers using CodeSync to manage their projects.
          Free to start, no credit card required.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/signup" className="btn-primary text-base !px-10 !py-4">
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Get Started Free
          </Link>
          <Link
            href="/repos"
            className="btn-secondary text-base !px-10 !py-4"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Browse Repos
          </Link>
        </div>
      </div>
    </section>
  );
}
