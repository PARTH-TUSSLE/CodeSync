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
        Once created, you land on the{" "}
        <strong>Setup page</strong> (<code>/repos/&lt;id&gt;/setup</code>). This
        page shows your repository ID (click to copy) and the CLI commands you
        need to push code. Click <strong>Go to Repository</strong> to view your
        empty repo, or follow the steps below to push code from your terminal.
      </p>

      <h2 id="pushing-code-with-the-cli" className="heading-anchor">
        Pushing Code with the CLI
      </h2>
      <p>
        The CodeSync CLI works from <strong>any directory</strong> on your
        machine. After installing it globally, you can push code to any repo:
      </p>
      <ol>
        <li>
          <strong>Install the CLI globally</strong> (one time):
          <CodeBlock
            language="bash"
            code={`cd /path/to/CodeSync/backend
npm run build
npm install -g .`}
          />
        </li>
        <li>
          <strong>Login</strong> (one time). Your browser opens — click{" "}
          <strong>Connect this device</strong> to authorize:
          <CodeBlock
            language="bash"
            code="codesync login --api-url http://localhost:8000"
          />
          On a headless machine, use{" "}
          <code>codesync login &lt;token&gt;</code> with a token from{" "}
          <Link href="/docs/profile">Profile &rarr; CLI Token</Link>.
        </li>
        <li>
          <strong>In your project directory</strong>, init and push:
          <CodeBlock
            language="bash"
            code={`cd ~/my-project
codesync init <repoId>
# create your files...
codesync add .
codesync commit "Initial commit"
codesync push`}
          />
        </li>
      </ol>
      <p>
        After pushing, refresh your repo page — you will see the file tree,
        syntax-highlighted code, README rendering, and commit history.
      </p>
      <p>
        For detailed CLI usage, see the{" "}
        <Link href="/docs/cli">CLI Guide</Link>.
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
