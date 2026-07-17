import Link from "next/link";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";

export default function CLIPage() {
  return (
    <>
      <h1>CLI Guide</h1>
      <p className="lead">
        The CodeSync CLI provides a Git-inspired command-line interface for
        managing your repositories directly from the terminal.
      </p>

      <hr />

      <h2 id="overview" className="heading-anchor">
        Overview
      </h2>
      <p>
        The CodeSync CLI is built directly into the CodeSync backend server. It
        supports the core version control workflow: initialize a repository,
        stage files, commit changes, push to remote, pull updates, and revert
        mistakes. The CLI is designed to feel familiar to anyone who has used
        Git.
      </p>

      <h2 id="installation" className="heading-anchor">
        Installation
      </h2>
      <p>
        The CLI is included with the CodeSync backend. To start the server and
        enable CLI commands, run:
      </p>
      <CodeBlock
        language="bash"
        code="node dist/index.js start"
      />
      <p>
        Once the server is running, you can use the CLI commands directly from
        your terminal.
      </p>

      <h2 id="authentication" className="heading-anchor">
        Authentication
      </h2>
      <p>
        Before using the CLI, you need to authenticate with your CodeSync
        account. The CLI stores your credentials in{" "}
        <code>~/.codesync/config.json</code>.
      </p>

      <h3>Logging In</h3>
      <p>
        To log in, you need your JWT token. You can get this from:
      </p>
      <ul>
        <li>
          Your <Link href="/docs/profile">CLI Token settings</Link> page on
          CodeSync.
        </li>
        <li>
          The token displayed after signing up (if you saved it).
        </li>
      </ul>
      <p>
        Once you have your token, log in with:
      </p>
      <CodeBlock
        language="bash"
        code="codesync login <your-jwt-token>"
      />
      <p>
        Replace <code>{'<your-jwt-token>'}</code> with your actual JWT token.
        The token is stored locally and used for all subsequent CLI commands.
      </p>

      <h3>Logging Out</h3>
      <p>To remove your stored credentials:</p>
      <CodeBlock
        language="bash"
        code="codesync logout"
      />
      <p>
        This removes the stored token from <code>~/.codesync/config.json</code>.
        You will need to log in again before using CLI commands.
      </p>

      <Callout type="warning" title="Token Security">
        Your JWT token grants full access to your CodeSync account. Never share
        it or commit it to version control. Treat it like a password.
      </Callout>

      <hr />

      <h2 id="commands" className="heading-anchor">
        Commands
      </h2>
      <p>
        CodeSync CLI supports the following commands:
      </p>

      {/* Init */}
      <h3 id="cmd-init" className="heading-anchor">codesync init</h3>
      <p>
        Initializes a new CodeSync repository in the current directory. This
        creates a <code>.codesync</code> directory to store repository metadata.
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
            <td>Initialize a new CodeSync repository</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync init</code></td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Example:</strong></p>
      <CodeBlock
        language="bash"
        code="$ cd my-project
$ codesync init
Initialized empty CodeSync repository in .codesync/"
      />
      <p><strong>Expected result:</strong> A <code>.codesync</code> directory is created in your project folder, ready to track changes.</p>

      {/* Add */}
      <h3 id="cmd-add" className="heading-anchor">codesync add</h3>
      <p>
        Stages a file for the next commit. This tells CodeSync to track changes
        to the specified file.
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
      <p><strong>Example:</strong></p>
      <CodeBlock
        language="bash"
        code="$ codesync add src/index.ts
Staged src/index.ts for commit"
      />
      <p><strong>Expected result:</strong> The specified file is staged and ready to be included in the next commit.</p>

      {/* Commit */}
      <h3 id="cmd-commit" className="heading-anchor">codesync commit</h3>
      <p>
        Creates a commit with all staged files. A commit is a snapshot of your
        project at a specific point in time.
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
            <td><code>{'<message>'}</code> — Commit message describing the changes</td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Example:</strong></p>
      <CodeBlock
        language="bash"
        code={`$ codesync commit "Add user authentication"
[main 1a2b3c4d] Add user authentication
 1 file changed, 42 insertions(+)`}
      />
      <p><strong>Expected result:</strong> A new commit is created with a unique commit ID. The commit is stored locally in the <code>.codesync</code> directory.</p>
      <Callout type="tip" title="Writing Commit Messages">
        Use clear, descriptive commit messages that explain <em>what</em> and{" "}
        <em>why</em>. Good commit messages help you understand the history of
        your project.
      </Callout>

      {/* Push */}
      <h3 id="cmd-push" className="heading-anchor">codesync push</h3>
      <p>
        Pushes your local commits to the remote CodeSync server, associating
        them with your repository.
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
            <td>Push local commits to the remote server</td>
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
      <p><strong>Example:</strong></p>
      <CodeBlock
        language="bash"
        code="$ codesync push
Pushing 1 commit to remote...
Successfully pushed to remote repository"
      />
      <p><strong>Expected result:</strong> All local commits are pushed to the remote server. A push activity is logged for your contributions.</p>
      <Callout type="note">
        You must be authenticated (<code>codesync login</code>) before you can
        push. The push command sends all commits that have not yet been pushed.
      </Callout>

      {/* Pull */}
      <h3 id="cmd-pull" className="heading-anchor">codesync pull</h3>
      <p>
        Pulls the latest changes from the remote server, updating your local
        repository.
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
            <td>Pull latest changes from the remote server</td>
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
      <p><strong>Example:</strong></p>
      <CodeBlock
        language="bash"
        code="$ codesync pull
Pulling latest changes from remote...
Already up to date."
      />
      <p><strong>Expected result:</strong> If there are new changes on the remote server, they are pulled down to your local repository. If everything is current, you will see &ldquo;Already up to date.&rdquo;</p>

      {/* Revert */}
      <h3 id="cmd-revert" className="heading-anchor">codesync revert</h3>
      <p>
        Reverts your local repository to a specific commit. This undoes all
        changes made after the specified commit.
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
            <td>Revert to a specific commit</td>
          </tr>
          <tr>
            <td><strong>Syntax</strong></td>
            <td><code>codesync revert {'<commitID>'}</code></td>
          </tr>
          <tr>
            <td><strong>Arguments</strong></td>
            <td><code>{'<commitID>'}</code> — The ID of the commit to revert to</td>
          </tr>
          <tr>
            <td><strong>Requires Auth</strong></td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Example:</strong></p>
      <CodeBlock
        language="bash"
        code="$ codesync revert 1a2b3c4d
Reverted to commit 1a2b3c4d"
      />
      <p><strong>Expected result:</strong> Your local repository is reverted to the state of the specified commit. All commits after that point are undone locally.</p>
      <Callout type="warning" title="Revert is Local">
        Reverting only affects your local repository. To sync the reverted state
        with the remote server, you will need to push again.
      </Callout>

      <hr />

      <h2 id="cli-troubleshooting" className="heading-anchor">
        Troubleshooting
      </h2>

      <h3>&ldquo;Not authenticated&rdquo; error</h3>
      <p>
        If you see an authentication error when running push or pull, make sure
        you have logged in:
      </p>
      <CodeBlock
        language="bash"
        code="codesync login <your-jwt-token>"
      />
      <p>
        Your token can be found on the{" "}
        <Link href="/docs/profile">CLI Token page</Link> in your account
        settings.
      </p>

      <h3>&ldquo;Not a CodeSync repository&rdquo; error</h3>
      <p>
        This means the current directory has not been initialized. Run{" "}
        <code>codesync init</code> first to create a <code>.codesync</code>{" "}
        directory.
      </p>

      <h3>Token expired</h3>
      <p>
        JWT tokens expire after 7 days. If your token has expired, log in again
        with a fresh token from your CLI Token settings page.
      </p>

      <h3>CLI commands not found</h3>
      <p>
        Make sure the CodeSync backend server is running. The CLI commands are
        processed by the backend process. Start the server with:
      </p>
      <CodeBlock
        language="bash"
        code="node dist/index.js start"
      />
      <p>
        For more help, visit the{" "}
        <Link href="/docs/troubleshooting">Troubleshooting</Link> page or check
        the <Link href="/docs/faq">FAQ</Link>.
      </p>
    </>
  );
}
