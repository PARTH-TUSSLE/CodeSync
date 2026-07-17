import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.03)_0%,transparent_60%)]" />
      <div className="relative z-10 text-center">
        <div className="mb-4 font-mono text-8xl font-bold text-gradient">
          404
        </div>
        <p className="mb-2 text-xl text-primary">
          Page not found
        </p>
        <p className="mb-8 text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-primary"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go home
        </Link>
      </div>
    </div>
  );
}
