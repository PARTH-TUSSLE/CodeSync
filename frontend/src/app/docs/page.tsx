import Link from "next/link";
import { Callout } from "@/components/docs/Callout";

export default function DocsWelcomePage() {
  return (
    <>
      <h1>Welcome to CodeSync</h1>
      <p className="lead">
        CodeSync is a modern, Git-inspired version control platform designed for
        the contemporary developer. Sync your code, track issues, visualize
        contributions, and collaborate — all from one sleek interface.
      </p>

      <hr />

      <h2 id="what-is-codesync" className="heading-anchor">
        What is CodeSync?
      </h2>
      <p>
        CodeSync provides a complete version control experience with an intuitive
        web dashboard and a powerful command-line interface (CLI). Whether you are
        working on a personal project or collaborating with a team, CodeSync makes
        it easy to manage your code, track issues, and showcase your contributions.
      </p>
      <p>
        Built with a developer-first philosophy, CodeSync offers the tools you need
        without the complexity. From creating repositories to pushing commits via
        the CLI, every feature is designed to be straightforward and efficient.
      </p>

      <h2 id="key-features" className="heading-anchor">
        Key Features
      </h2>
      <div className="feature-grid feature-grid-3">
        <div className="feature-card">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Repositories</h4>
          <p className="!mb-0 text-sm text-muted">
            Create public or private repositories with ease. Browse, search, star, and pin your favorites.
          </p>
        </div>
        <div className="feature-card">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </div>
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Issue Tracking</h4>
          <p className="!mb-0 text-sm text-muted">
            Track bugs, feature requests, and tasks with a simple but powerful issue management system.
          </p>
        </div>
        <div className="feature-card">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">CLI Tool</h4>
          <p className="!mb-0 text-sm text-muted">
            A Git-inspired CLI for init, add, commit, push, pull, and revert — all from your terminal.
          </p>
        </div>
        <div className="feature-card">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Profiles &amp; Contributions</h4>
          <p className="!mb-0 text-sm text-muted">
            Showcase your work with customizable profiles and a GitHub-style contribution heatmap.
          </p>
        </div>
        <div className="feature-card">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Starring &amp; Pinning</h4>
          <p className="!mb-0 text-sm text-muted">
            Star repositories you love and pin your most important projects to your profile.
          </p>
        </div>
        <div className="feature-card">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Search</h4>
          <p className="!mb-0 text-sm text-muted">
            Quickly find repositories across the platform with instant search and filtering.
          </p>
        </div>
      </div>

      <h2 id="why-codesync" className="heading-anchor">
        Why Use CodeSync?
      </h2>
      <p>
        CodeSync is built for developers who want a straightforward, modern
        version control experience. Here is why you should consider it:
      </p>
      <ul>
        <li>
          <strong>Minimal Setup</strong> — Create an account and start using the
          platform immediately. No complex configuration required.
        </li>
        <li>
          <strong>Developer-First Design</strong> — Every feature is designed with
          the developer workflow in mind, from the CLI to the dashboard.
        </li>
        <li>
          <strong>Beautiful Interface</strong> — A premium, dark-mode-first UI
          that is a pleasure to use, day or night.
        </li>
        <li>
          <strong>CLI Integration</strong> — Use familiar Git-inspired commands
          to manage your repositories from the terminal.
        </li>
        <li>
          <strong>Open &amp; Transparent</strong> — Public repositories are
          visible to everyone, fostering collaboration and discovery.
        </li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/docs/getting-started"
          className="btn-primary !rounded-lg !px-5 !py-2.5 text-sm no-underline"
        >
          Get Started
        </Link>
        <Link
          href="/signup"
          className="btn-secondary !rounded-lg !px-5 !py-2.5 text-sm no-underline"
        >
          Create an Account
        </Link>
      </div>
    </>
  );
}
