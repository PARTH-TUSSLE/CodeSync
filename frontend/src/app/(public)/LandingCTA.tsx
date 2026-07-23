import Link from "next/link";

export function LandingCTA() {
  return (
    <section className="relative z-10 border-t border-glass-border bg-surface py-28 lg:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(0,229,255,0.04)_0%,transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="section-label justify-center">Get Started</div>
        <h2 className="heading-lg text-balance mb-5">
          Ready to{" "}
          <span className="text-gradient">sync your code?</span>
        </h2>
        <p className="body-lg mx-auto mb-12 max-w-lg text-balance">
          Join thousands of developers using CodeSync.
          Free to start, no credit card required.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-primary px-8 text-sm font-semibold tracking-[-0.01em] text-surface transition-all hover:opacity-90"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started Free
          </Link>
          <Link
            href="/repos"
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-glass-border px-8 text-sm font-medium tracking-[-0.01em] text-primary transition-all hover:bg-glass-hover"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Browse Repos
          </Link>
        </div>
      </div>
    </section>
  );
}
