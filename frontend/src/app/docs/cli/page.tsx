import Link from "next/link";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";

export default function CLIPage() {
  return (
    <>
      <h1>CLI Guide</h1>
      <p className="lead">
        The CodeSync CLI provides a Git-inspired command-line interface for
        managing your repositories directly from the terminal. Unlike Git, the
        CodeSync CLI requires a running backend server to store your data.
      </p>

      <hr />

      <h2 id="overview" className="heading-anchor">
        Overview
      </h2>
      <p>
        The CLI works from <strong>any directory</strong> on your machine. It
        creates a <code>.codesync</code> folder in your project (just like
        <code>.git</code>) to track local state. Commands like{" "}
        <code>init</code>, <code>push</code>, <code>branch</code>, and{" "}
        <code>pull</code> let you sync code between your local machine and the
        CodeSync web dashboard.
      </p>

      <h2 id="prerequisites" className="heading-anchor">
        Prerequisites
      </h2>
      <p>
        Before using the CLI, make sure:
      </p>
      <ol>
        <li>
          The <strong>backend server</strong> is running
          (<code>npx tsx src/index.ts start</code> from the
          <code>backend/</code> directory).
        </li>
        <li>
          You have a <strong>CodeSync account</strong> and can log in to the web
          app at <code>http://localhost:3000</code>.
        </li>
      </ol>

      <h2 id="installation" className="heading-anchor">
        Installation
      </h2>
      <p>
        The CLI is included in the <code>backend/</code> directory. Install it
        globally so the <code>codesync</code> command is available anywhere:
      </p>
      <CodeBlock
        language="bash"
        code={`cd /path/to/CodeSync/backend
npm run build
npm install -g .`}
      />
      <p>
        After this, you can run <code>codesync</code> from any directory.
      </p>
      <Callout type="tip" title="Verify Installation">
        Run <code>codesync --help</code> to see all available commands.
      </Callout>

      <h2 id="authentication" className="heading-anchor">
        Authentication
      </h2>
      <p>
        Before using the CLI, you need to authenticate with your CodeSync
        account. The CLI stores your credentials in{" "}
        <code>~/.codesync/config.json</code> (global, across all projects).
      </p>

      <h3>Browser Device Flow (recommended)</h3>
      <p>
        You don&apos;t need a token to log in. Just run{" "}
        <code>codesync login</code> with no arguments — the CLI opens your
        browser where you approve the connection with a single click:
      </p>
      <CodeBlock
        language="bash"
        code="codesync login --api-url http://localhost:8000"
      />
      <ol>
        <li>
          The CLI prints a link and a pairing code, then opens your browser.
        </li>
        <li>
          Make sure you are logged in to the web app in that browser.
        </li>
        <li>
          Click <strong>Connect this device</strong> (the code is pre-filled).
        </li>
        <li>
          The CLI finishes the login automatically and stores a long-lived
          credential — you only ever do this once.
        </li>
      </ol>

      <h3>Token Login (alternative)</h3>
      <p>
        If you prefer, or if you are on a machine without a browser, you can
        log in with your authentication token:
      </p>
      <CodeBlock
        language="bash"
        code="codesync login <your-jwt-token> --api-url http://localhost:8000"
      />
      <p>
        Get the token from the{" "}
        <Link href="/docs/profile">CLI Token settings</Link> page in the web
        app.
      </p>

      <h3>Logging Out</h3>
      <p>To remove your stored credentials:</p>
      <CodeBlock
        language="bash"
        code="codesync logout"
      />

      <Callout type="warning" title="Credential Security">
        The stored credential grants full access to your CodeSync account. Never
        share it or commit it to version control. Treat it like a password.
      </Callout>

      <hr />

      <h2 id="quick-start" className="heading-anchor">
        Quick Start (Typical Workflow)
      </h2>
      <p>
        Here is the typical end-to-end workflow:
      </p>
      <CodeBlock
        language="bash"
        code={`# 1. Create a repo on the web app first (at /repos/new)
#    Copy the repo ID from the setup page

# 2. In your project directory, init and link to that repo
cd /my/project
codesync init <repoId>

# 3. Create some files, then push them
codesync add .
codesync commit "Initial commit"
codesync push

# 4. View the result at /repos/<repoId> in the browser`}
      />
      <p>
        The rest of this guide explains each command in detail.
      </p>

      <hr />

      <h2 id="commands" className="heading-anchor">
        Commands
      </h2>

      <h3 id="cmd-init" className="heading-anchor">codesync init</h3>
      <p>
        Initializes a CodeSync repository in the <strong>current directory</strong>.
        Creates a <code>.codesync</code> folder to store repository metadata,
        staging area, and local commits.
      </p>
      <table className="command-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Description</strong></td>
            <td>Initialize a new CodeSync repository locally</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync init [repoId]</code></td>
          </tr>
          <tr>
            <td><strong>Arguments</strong></td>
            <td><code>repoId</code> (optional) — Link to an existing remote repo</td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="bash"
        code={`$ cd my-project
$ codesync init abc-123
✓ Repository initialised successfully!
✓ Linked to CodeSync repo: abc-123`}
      />
      <p>
        If you omit the repo ID, you can set it later with{" "}
        <code>codesync remote &lt;repoId&gt;</code>.
      </p>

      <h3 id="cmd-remote" className="heading-anchor">codesync remote</h3>
      <p>
        Link the local repo to a remote CodeSync repository, or show the
        currently linked remote.
      </p>
      <table className="command-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Description</strong></td>
            <td>Set or show the linked remote repository</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync remote [repoId]</code></td>
          </tr>
          <tr>
            <td><strong>Set</strong></td>
            <td><code>codesync remote abc-123</code></td>
          </tr>
          <tr>
            <td><strong>Show</strong></td>
            <td><code>codesync remote</code> (no arguments)</td>
          </tr>
        </tbody>
      </table>

      <h3 id="cmd-add" className="heading-anchor">codesync add</h3>
      <p>
        Stages a file for the next commit. Copies the file into the{" "}
        <code>.codesync/staging/</code> directory.
      </p>
      <table className="command-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Description</strong></td>
            <td>Stage a file for commit</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync add {'<file>'}</code></td>
          </tr>
          <tr>
            <td><strong>Arguments</strong></td>
            <td><code>{'<file>'}</code> — Path to the file to stage</td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="bash"
        code={`$ codesync add README.md
File README.md added to the staging area !`}
      />

      <h3 id="cmd-commit" className="heading-anchor">codesync commit</h3>
      <p>
        Creates a local commit with all currently staged files. The commit is
        stored in <code>.codesync/commits/</code> and will be sent to the server
        on the next <code>push</code>.
      </p>
      <table className="command-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Description</strong></td>
            <td>Create a commit with staged files</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync commit {'<message>'}</code></td>
          </tr>
          <tr>
            <td><strong>Arguments</strong></td>
            <td><code>{'<message>'}</code> — Commit message</td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>No (tracking requires login)</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="bash"
        code={`$ codesync commit "Add README"
Commit a1b2c3d4 created with message: Add README!`}
      />
      <Callout type="tip" title="Commit Messages">
        Use clear, descriptive commit messages. Good messages help you
        understand the history of your project.
      </Callout>

      <h3 id="cmd-push" className="heading-anchor">codesync push</h3>
      <p>
        Pushes all local commits to the remote CodeSync server. Commits appear
        in the web dashboard under the Commits tab.
      </p>
      <table className="command-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Description</strong></td>
            <td>Send local commits to the remote server</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync push</code></td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="bash"
        code={`$ codesync push
Pushing 1 commit(s) to CodeSync...
  ↻ a1b2c3d4... ✓ (f5e6d7c8)
✓ All commits pushed successfully! (1 commit(s))`}
      />
      <Callout type="note">
        You must be logged in (<code>codesync login</code>) and have a remote
        set (<code>codesync init &lt;repoId&gt;</code>) before pushing.
      </Callout>

      <h3 id="cmd-branch" className="heading-anchor">codesync branch</h3>
      <p>
        Create a new branch or list existing branches. Works like Git branches
        — you can develop features in isolation and switch between them.
      </p>
      <table className="command-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Create</strong></td>
            <td><code>codesync branch {'<name>'}</code></td>
          </tr>
          <tr>
            <td><strong>List</strong></td>
            <td><code>codesync branch</code> (no arguments)</td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="bash"
        code={`$ codesync branch feature
✓ Switched to new branch 'feature'

$ codesync branch
Branches:
  main
* feature`}
      />

      <h3 id="cmd-checkout" className="heading-anchor">codesync checkout</h3>
      <p>
        Switch to an existing branch. All subsequent commits and pushes will be
        associated with this branch.
      </p>
      <table className="command-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Description</strong></td>
            <td>Switch to a branch</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync checkout {'<name>'}</code></td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="bash"
        code={`$ codesync checkout main
✓ Switched to branch 'main'`}
      />

      <h3 id="cmd-pull" className="heading-anchor">codesync pull</h3>
      <p>
        Downloads the latest files from the remote repository for the current
        branch and writes them into your project directory.
      </p>
      <table className="command-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Description</strong></td>
            <td>Pull latest files from the remote server</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync pull</code></td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="bash"
        code={`$ codesync pull
Pulling latest files from main...
✓ Pulled 3 file(s) from main`}
      />

      <h3 id="cmd-revert" className="heading-anchor">codesync revert</h3>
      <p>
        Restores your local project files to the state of a specific commit.
        Useful for undoing changes.
      </p>
      <table className="command-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Description</strong></td>
            <td>Revert local files to a specific commit</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync revert {'<commitID>'}</code></td>
          </tr>
          <tr>
            <td><strong>Arguments</strong></td>
            <td><code>{'<commitID>'}</code> — The commit ID to revert to</td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="bash"
        code={`$ codesync revert a1b2c3d4
Successfully reverted the codebase to commit - a1b2c3d4`}
      />
      <Callout type="warning" title="Revert is Local">
        Reverting only affects your local files. To sync the reverted state
        with the remote server, push again.
      </Callout>

      <hr />

      <h2 id="full-example" className="heading-anchor">
        Full Workflow Example
      </h2>
      <CodeBlock
        language="bash"
        code={`# === Terminal 1: Start the backend server ===
cd CodeSync/backend
npx tsx src/index.ts start

# === Web browser: Create an account and a repo ===
# 1. Go to http://localhost:3000/signup
# 2. Create a repository at /repos/new
# 3. Copy the repo ID from the setup page

# === Terminal 2: Use the CLI from any directory ===

# Install the CLI globally (one time)
cd CodeSync/backend
npm run build
npm install -g .

# Login (one time) — your browser opens, click "Connect this device"
codesync login --api-url http://localhost:8000

# Now work in any project folder
cd ~/projects/my-app

# Init and link to your repo
codesync init <repoId>

# Create files
echo "# Hello World" > README.md
echo "console.log('hi');" > index.js

# Stage, commit, push
codesync add README.md
codesync add index.js
codesync commit "Add initial files"
codesync push

# Create a feature branch
codesync branch feature
echo "// new feature" > feature.js
codesync add feature.js
codesync commit "Add feature"
codesync push

# Switch back to main
codesync checkout main

# Pull latest
codesync pull`}
      />

      <hr />

      <h2 id="cli-troubleshooting" className="heading-anchor">
        Troubleshooting
      </h2>

      <h3>&ldquo;Not authenticated&rdquo; error</h3>
      <p>
        Run <code>codesync login</code> to authorize your device from the
        browser. If you are on a headless machine, use{" "}
        <code>codesync login &lt;token&gt;</code> with a token from the{" "}
        <Link href="/docs/profile">CLI Token page</Link>.
      </p>

      <h3>&ldquo;Not a CodeSync repository&rdquo; error</h3>
      <p>
        The current directory has no <code>.codesync</code> folder. Run{" "}
        <code>codesync init &lt;repoId&gt;</code> first.
      </p>

      <h3>&ldquo;No remote set&rdquo; error</h3>
      <p>
        Run <code>codesync init &lt;repoId&gt;</code> or{" "}
        <code>codesync remote &lt;repoId&gt;</code> to link to a remote repo.
      </p>

      <h3>Token expired</h3>
      <p>
        CLI credentials issued through the device flow last for one year. If you
        logged in with a web JWT token instead, it expires after 7 days — re-run{" "}
        <code>codesync login</code> (or <code>codesync login &lt;token&gt;</code>)
        with a fresh token from the{" "}
        <Link href="/docs/profile">CLI Token page</Link>.
      </p>

      <h3>Backend not reachable</h3>
      <p>
        Make sure the backend server is running and the <code>--api-url</code>{" "}
        is correct. Default is <code>http://localhost:8000</code>.
      </p>
    </>
  );
}
