import Link from "next/link";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";

export default function GettingStartedPage() {
  return (
    <>
      <h1>Getting Started</h1>
      <p className="lead">
        Get up and running with CodeSync in minutes. This guide walks you through
        creating an account, signing in, and making your first repository.
      </p>

      <hr />

      <h2 id="creating-an-account" className="heading-anchor">
        Creating an Account
      </h2>
      <p>
        To get started with CodeSync, you first need to create an account. Visit
        the signup page and provide the following:
      </p>
      <ul>
        <li>
          <strong>Username</strong> — A unique public identifier (e.g.,{" "}
          <code>johndoe</code>)
        </li>
        <li>
          <strong>Email</strong> — A valid email address for account recovery
        </li>
        <li>
          <strong>Password</strong> — A secure password (min 6 characters)
        </li>
      </ul>
      <Callout type="tip" title="Account Security">
        Choose a strong password. You will need it every time you sign in. Your
        email is only used for account management and is never shared publicly.
      </Callout>
      <p>
        After submitting the form, you will receive your JWT authentication
        token. This token is also used to authenticate with the CLI. Save it in
        a secure place — you can always retrieve it later from your{" "}
        <Link href="/docs/profile">CLI Token settings</Link>.
      </p>

      <h2 id="signing-in" className="heading-anchor">
        Signing In
      </h2>
      <p>
        Once you have an account, signing in is straightforward:
      </p>
      <ol>
        <li>Navigate to the <strong>Login</strong> page.</li>
        <li>
          Enter your <strong>username</strong> or <strong>email</strong> along
          with your password.
        </li>
        <li>Click <strong>Sign In</strong>.</li>
      </ol>
      <p>
        After signing in, you will be redirected to the home page. Your session
        is persisted using both <code>localStorage</code> and a cookie, so you
        will stay logged in across page visits.
      </p>
      <Callout type="note">
        If you are already signed in and try to visit the Login or Signup pages,
        you will be automatically redirected to the home page.
      </Callout>

      <h2 id="your-first-repository" className="heading-anchor">
        Your First Repository
      </h2>
      <p>
        Creating your first repository on CodeSync is simple:
      </p>
      <ol>
        <li>
          Click the <strong>Create Repository</strong> button or navigate to{" "}
          <code>/repos/new</code>.
        </li>
        <li>
          Give your repository a <strong>name</strong> (e.g.,{" "}
          <code>my-first-project</code>).
        </li>
        <li>
          Optionally, add a <strong>description</strong> to explain what your
          project does.
        </li>
        <li>
          Choose the <strong>visibility</strong>:
          <ul>
            <li>
              <strong>Public</strong> — Visible to everyone on the platform.
            </li>
            <li>
              <strong>Private</strong> — Only visible to you (and collaborators
              in the future).
            </li>
          </ul>
        </li>
        <li>Click <strong>Create</strong>.</li>
      </ol>
      <p>
        Once created, you will be redirected to your new repository page, where
        you can view details, manage issues, and star or pin the repository.
      </p>

      <h2 id="navigating-the-dashboard" className="heading-anchor">
        Navigating the Dashboard
      </h2>
      <p>
        The CodeSync interface is designed to be intuitive. Here is a quick tour:
      </p>
      <div className="feature-grid">
        <div className="feature-card">
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Top Navigation Bar</h4>
          <p className="!mb-0 text-sm text-muted">
            Access the search bar, theme toggle, and user menu. The Explore link
            takes you to all public repositories.
          </p>
        </div>
        <div className="feature-card">
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Explore Page</h4>
          <p className="!mb-0 text-sm text-muted">
            Browse all public repositories with pagination. Search by name to
            find specific projects.
          </p>
        </div>
        <div className="feature-card">
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">User Menu</h4>
          <p className="!mb-0 text-sm text-muted">
            Click your avatar to access your Profile, My Repos, Starred
            repositories, Contributions, and Logout.
          </p>
        </div>
        <div className="feature-card">
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Profile Page</h4>
          <p className="!mb-0 text-sm text-muted">
            View your public profile with bio, stats, pinned repos, and
            contribution heatmap.
          </p>
        </div>
      </div>

      <h3>Quick Links</h3>
      <ul>
        <li>
          <Link href="/repos">Explore Repositories</Link>
        </li>
        <li>
          <Link href="/repos/new">Create a Repository</Link>
        </li>
        <li>
          <Link href="/docs/cli">CLI Guide</Link>
        </li>
        <li>
          <Link href="/docs/faq">FAQ</Link>
        </li>
      </ul>
    </>
  );
}
