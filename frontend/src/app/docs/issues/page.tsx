import Link from "next/link";
import { Callout } from "@/components/docs/Callout";

export default function IssuesPage() {
  return (
    <>
      <h1>Issues</h1>
      <p className="lead">
        Issues help you track bugs, feature requests, and tasks within your
        repositories. CodeSync provides a clean, minimal issue tracking system.
      </p>

      <hr />

      <h2 id="creating-issues" className="heading-anchor">
        Creating Issues
      </h2>
      <p>
        Anyone can create an issue in a public repository. To create an issue:
      </p>
      <ol>
        <li>
          Navigate to the repository where you want to create the issue.
        </li>
        <li>
          Click the <strong>Issues</strong> tab or navigate to{" "}
          <code>/repos/[id]/issues</code>.
        </li>
        <li>
          Click the <strong>New Issue</strong> button.
        </li>
        <li>
          Fill in the <strong>Title</strong> — a clear, concise summary of the
          issue.
        </li>
        <li>
          Fill in the <strong>Description</strong> — detailed information about
          the issue. Include steps to reproduce if reporting a bug.
        </li>
        <li>Click <strong>Create Issue</strong>.</li>
      </ol>
      <Callout type="tip" title="Writing Good Issues">
        A good issue title is specific and actionable. For example, instead of
        &ldquo;Login bug,&rdquo; use &ldquo;Login fails with correct credentials
        on Firefox.&rdquo;
      </Callout>

      <h2 id="managing-issues" className="heading-anchor">
        Managing Issues
      </h2>
      <p>
        The issues list page shows all issues for a repository, with filtering
        options:
      </p>
      <div className="feature-grid">
        <div className="feature-card">
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Status Filter</h4>
          <p className="!mb-0 text-sm text-muted">
            Filter issues by <strong>All</strong>, <strong>Open</strong>, or{" "}
            <strong>Closed</strong>. The filter tabs show counts for each status.
          </p>
        </div>
        <div className="feature-card">
          <h4 className="!mt-0 !mb-1 text-sm font-semibold text-primary">Issue Cards</h4>
          <p className="!mb-0 text-sm text-muted">
            Each issue displays its title, ID, status badge (Open/Closed), and
            creation date. Click on any issue to view its full details.
          </p>
        </div>
      </div>
      <p>
        On the issue detail page, you can:
      </p>
      <ul>
        <li>View the full title and description.</li>
        <li>See the author and creation date.</li>
        <li>Toggle the issue status (Close/Reopen).</li>
        <li>
          Edit the issue (author only) — update the title and description.
        </li>
        <li>Delete the issue (author only) — permanently remove it.</li>
      </ul>
      <Callout type="note">
        Only the issue author can edit or delete an issue. Repository owners
        can close and reopen any issue in their repository.
      </Callout>

      <h2 id="closing-and-reopening" className="heading-anchor">
        Closing &amp; Reopening Issues
      </h2>
      <p>
        Issues can be toggled between <strong>Open</strong> and{" "}
        <strong>Closed</strong> states:
      </p>
      <ul>
        <li>
          <strong>Close</strong> — Use this when an issue has been resolved or is
          no longer relevant. Closed issues are hidden by default in the filter
          but can be viewed by selecting the &ldquo;Closed&rdquo; tab.
        </li>
        <li>
          <strong>Reopen</strong> — If an issue resurfaces or was closed
          prematurely, you can reopen it to bring it back to the active list.
        </li>
      </ul>
      <p>
        The status toggle button is available on the issue detail page. The
        button changes contextually:
      </p>
      <ul>
        <li>
          If the issue is <strong>Open</strong>, the button shows{" "}
          <strong>Close Issue</strong>.
        </li>
        <li>
          If the issue is <strong>Closed</strong>, the button shows{" "}
          <strong>Reopen Issue</strong>.
        </li>
      </ul>
      <Callout type="warning" title="Closed Issues Are Not Deleted">
        Closing an issue does not delete it. All issue history is preserved and
        can be viewed at any time by filtering to show closed issues.
      </Callout>

      <h3>Issue Status Badges</h3>
      <p>
        Each issue displays a status badge:
      </p>
      <ul>
        <li>
          <span className="badge-green">Open</span> — The issue is active and
          awaiting resolution.
        </li>
        <li>
          <span className="badge-red">Closed</span> — The issue has been
          resolved or dismissed.
        </li>
      </ul>
    </>
  );
}
