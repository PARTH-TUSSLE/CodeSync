import Link from "next/link";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";

export default function TroubleshootingPage() {
  return (
    <>
      <h1>Troubleshooting</h1>
      <p className="lead">
        Solutions to common issues you might encounter while using CodeSync.
        If your issue persists, check the <Link href="/docs/faq">FAQ</Link> or
        reach out for support.
      </p>

      <hr />

      <h2 id="authentication-issues" className="heading-anchor">
        Authentication Issues
      </h2>

      <h3>Cannot sign in</h3>
      <p>
        If you are having trouble signing in:
      </p>
      <ul>
        <li>
          Make sure you are using the correct <strong>username or email</strong>.
        </li>
        <li>
          Check that your <strong>password</strong> is correct. Passwords are
          case-sensitive.
        </li>
        <li>
          If you forgot your password, account recovery is not yet available.
          Contact support for assistance.
        </li>
      </ul>

      <h3>Session expires frequently</h3>
      <p>
        Your session token is stored in both <code>localStorage</code> and a
        cookie with a 7-day expiry. If you are being logged out frequently:
      </p>
      <ul>
        <li>Check that cookies are enabled in your browser.</li>
        <li>
          Ensure your browser is not clearing local storage or cookies on exit.
        </li>
        <li>
          Clear your browser cache and local storage, then sign in again.
        </li>
      </ul>
      <Callout type="tip">
        You can also try using a different browser or incognito/private mode to
        isolate the issue.
      </Callout>

      <h2 id="repository-issues" className="heading-anchor">
        Repository Issues
      </h2>

      <h3>Cannot create a repository</h3>
      <p>
        If the repository creation fails:
      </p>
      <ul>
        <li>
          Make sure you are <strong>signed in</strong>. Repository creation
          requires authentication.
        </li>
        <li>
          Check that the <strong>repository name</strong> is unique within your
          account. Duplicate names are not allowed.
        </li>
        <li>
          Ensure the repository name contains only valid characters (letters,
          numbers, hyphens, underscores).
        </li>
      </ul>

      <h3>Repository not showing up</h3>
      <p>
        If a repository you created is not appearing:
      </p>
      <ul>
        <li>
          <strong>Private repositories</strong> only appear when you are signed
          in and viewing your own repositories.
        </li>
        <li>
          Check the <strong>Explore page</strong> — only public repositories
          appear there.
        </li>
        <li>
          Navigate to your profile and click the repos link to see all your
          repositories.
        </li>
      </ul>

      <h3>Cannot delete a repository</h3>
      <p>
        Only the repository owner can delete a repository. If you are the owner
        and still cannot delete:
      </p>
      <ul>
        <li>Make sure you are signed in with the correct account.</li>
        <li>
          The delete button requires typing the repository name to confirm.
          Type it exactly as shown.
        </li>
      </ul>

      <h2 id="issue-tracking-issues" className="heading-anchor">
        Issue Tracking Issues
      </h2>

      <h3>Cannot create an issue</h3>
      <ul>
        <li>
          You must be <strong>signed in</strong> to create an issue.
        </li>
        <li>
          Make sure the repository exists and is accessible. You can create
          issues in any public repository.
        </li>
      </ul>

      <h3>Cannot edit or delete an issue</h3>
      <p>
        Only the issue author can edit or delete an issue. If you are the author
        and still having issues:
      </p>
      <ul>
        <li>Make sure you are signed in with the account that created the issue.</li>
        <li>Try refreshing the page and attempting the action again.</li>
      </ul>

      <h2 id="cli-issues" className="heading-anchor">
        CLI Issues
      </h2>

      <h3>&ldquo;command not found: codesync&rdquo;</h3>
      <p>
        If the <code>codesync</code> command is not recognized:
      </p>
      <ul>
        <li>
          Make sure the CodeSync backend server is <strong>running</strong>.
        </li>
        <li>
          Start the server with:{" "}
          <code>node dist/index.js start</code>
        </li>
        <li>
          Ensure you are in the correct directory where the backend is
          installed.
        </li>
      </ul>

      <h3>&ldquo;Not authenticated&rdquo;</h3>
      <p>
        This error occurs when you try to push or pull without valid credentials:
      </p>
      <CodeBlock
        language="bash"
        code="codesync login"
      />
      <p>
        Your browser opens and you approve the connection with one click. On a
        headless machine, use{" "}
        <code>codesync login &lt;token&gt;</code> with a token from the{" "}
        <Link href="/docs/profile">CLI Token settings</Link> page.
      </p>

      <h3>&ldquo;Not a CodeSync repository&rdquo;</h3>
      <p>
        This means the current directory has not been initialized:
      </p>
      <CodeBlock
        language="bash"
        code="codesync init"
      />
      <p>
        This creates the <code>.codesync</code> directory needed for version
        control operations.
      </p>

      <h3>Push fails</h3>
      <p>
        If <code>codesync push</code> fails:
      </p>
      <ul>
        <li>Make sure you have commits to push (run <code>codesync commit</code> first).</li>
        <li>Check that you are authenticated (<code>codesync login</code>).</li>
        <li>Verify the backend server is running and accessible.</li>
      </ul>

      <h3>Token-related issues</h3>
      <ul>
        <li>
          <strong>Credential expired</strong> — Device-flow credentials last one
          year; web JWT tokens last 7 days. Re-run <code>codesync login</code>{" "}
          to refresh.
        </li>
        <li>
          <strong>Invalid token</strong> — Make sure you copied the entire token
          without any extra spaces or characters.
        </li>
        <li>
          <strong>Browser doesn&apos;t open</strong> — The CLI prints the
          authorization URL and pairing code. Open the URL manually, enter the
          code, and click <strong>Connect this device</strong>.
        </li>
      </ul>

      <h2 id="profile-issues" className="heading-anchor">
        Profile Issues
      </h2>

      <h3>Profile picture not updating</h3>
      <p>
        If your avatar does not change after uploading:
      </p>
      <ul>
        <li>Try refreshing the page (hard refresh with <kbd>Ctrl+Shift+R</kbd>).</li>
        <li>
          The image is stored as a data URI. Large images may take a moment to
          process.
        </li>
        <li>
          If the issue persists, try a smaller image file.
        </li>
      </ul>

      <h3>Contributions not showing</h3>
      <p>
        If your contribution heatmap appears empty:
      </p>
      <ul>
        <li>
          Contributions are tracked based on your activities (commits, pushes,
          creating issues, etc.).
        </li>
        <li>
          Make sure you have performed tracked activities while signed in.
        </li>
        <li>
          Try selecting a different year using the year picker.
        </li>
      </ul>

      <h2 id="general-issues" className="heading-anchor">
        General Issues
      </h2>

      <h3>Page not loading</h3>
      <ul>
        <li>Check your internet connection.</li>
        <li>Try refreshing the page.</li>
        <li>Clear your browser cache and cookies.</li>
        <li>Try a different browser or incognito mode.</li>
      </ul>

      <h3>Theme not persisting</h3>
      <p>
        If the dark/light mode preference is not remembered:
      </p>
      <ul>
        <li>Make sure <code>localStorage</code> is enabled in your browser.</li>
        <li>The theme preference is stored in <code>localStorage</code> under the key <code>theme</code>.</li>
        <li>Check that your browser is not set to clear local storage on exit.</li>
      </ul>

      <h3>Style issues or broken layout</h3>
      <ul>
        <li>
          Try a <strong>hard refresh</strong> (<kbd>Ctrl+Shift+R</kbd>) to
          bypass cached styles.
        </li>
        <li>
          CodeSync uses Tailwind CSS v4 with CSS custom properties. Make sure
          your browser supports modern CSS features.
        </li>
        <li>
          If using an older browser, try upgrading to a modern browser like
          Chrome, Firefox, or Edge.
        </li>
      </ul>

      <hr />

      <div className="rounded-xl border border-glass-border bg-surface-secondary p-6">
        <h3 className="!mt-0">Still having trouble?</h3>
        <p className="text-sm text-muted">
          If none of these solutions help, check the{" "}
          <Link href="/docs/faq">FAQ</Link> or explore the{" "}
          <Link href="/docs">full documentation</Link> for more detailed
          guides.
        </p>
      </div>
    </>
  );
}
