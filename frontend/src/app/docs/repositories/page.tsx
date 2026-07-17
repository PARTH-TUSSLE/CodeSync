import Link from "next/link";
import { Callout } from "@/components/docs/Callout";

export default function RepositoriesPage() {
  return (
    <>
      <h1>Repositories</h1>
      <p className="lead">
        Repositories are the core of CodeSync. They store your project files,
        track issues, and showcase your work to the community.
      </p>

      <hr />

      <h2 id="creating-a-repository" className="heading-anchor">
        Creating a Repository
      </h2>
      <p>
        To create a new repository, click the <strong>Create Repository</strong>{" "}
        button or navigate to <code>/repos/new</code>. You need the following:
      </p>
      <ul>
        <li>
          <strong>Repository Name</strong> — A unique name for your repository.
          Names must be unique within your account.
        </li>
        <li>
          <strong>Description</strong> (optional) — A short description of your
          project.
        </li>
        <li>
          <strong>Visibility</strong> — Choose between Public and Private.
        </li>
      </ul>
      <Callout type="tip" title="Naming Tips">
        Choose a descriptive, URL-friendly name. Use hyphens to separate words
        (e.g., <code>my-awesome-project</code>).
      </Callout>

      <h2 id="editing-a-repository" className="heading-anchor">
        Editing a Repository
      </h2>
      <p>
        As the repository owner, you can update its name and description at any
        time. Navigate to your repository page and use the settings options to
        make changes. The repository ID remains the same, so existing links and
        references continue to work.
      </p>
      <Callout type="note">
        Only the repository owner can edit repository details. Other users can
        view public repositories but cannot modify them.
      </Callout>

      <h2 id="deleting-a-repository" className="heading-anchor">
        Deleting a Repository
      </h2>
      <p>
        If you no longer need a repository, you can delete it. This action is
        permanent and cannot be undone.
      </p>
      <ol>
        <li>Navigate to the repository you want to delete.</li>
        <li>
          Click the <strong>Delete</strong> button (only visible to the owner).
        </li>
        <li>
          Confirm the deletion by typing the repository name in the dialog.
        </li>
      </ol>
      <Callout type="warning" title="Irreversible Action">
        Deleting a repository removes all associated data, including issues.
        Make sure you have backed up any important information before proceeding.
      </Callout>

      <h2 id="repository-visibility" className="heading-anchor">
        Repository Visibility
      </h2>
      <p>
        CodeSync supports two visibility levels:
      </p>
      <div className="feature-grid">
        <div className="feature-card">
          <div className="mb-2 flex items-center gap-2">
            <span className="badge-green">Public</span>
          </div>
          <p className="!mb-0 text-sm text-muted">
            Visible to everyone on the platform. Anyone can view, star, and
            browse your public repositories. Public repos appear in search
            results and the Explore page.
          </p>
        </div>
        <div className="feature-card">
          <div className="mb-2 flex items-center gap-2">
            <span className="badge-amber">Private</span>
          </div>
          <p className="!mb-0 text-sm text-muted">
            Only visible to you. Private repositories do not appear in search
            results or the Explore page. You can toggle visibility at any time.
          </p>
        </div>
      </div>
      <p>
        You can toggle a repository between public and private at any time using
        the visibility toggle on the repository page (owner only).
      </p>

      <h2 id="browsing-repositories" className="heading-anchor">
        Browsing Repositories
      </h2>
      <p>
        The <Link href="/repos">Explore page</Link> shows all public
        repositories on CodeSync. You can:
      </p>
      <ul>
        <li>
          Browse through paginated results (10 repos per page).
        </li>
        <li>
          Search by repository name using the search bar.
        </li>
        <li>
          Click on any repository to view its details.
        </li>
      </ul>
      <p>
        Each repository card displays:
      </p>
      <ul>
        <li>Repository name and owner username</li>
        <li>Visibility badge (Public/Private)</li>
        <li>Description</li>
        <li>Creation date</li>
      </ul>
      <p>
        You can also view all repositories belonging to a specific user by
        navigating to their profile and selecting the repos link.
      </p>

      <h3>Repository Detail Page</h3>
      <p>
        Clicking on a repository takes you to its detail page, which shows:
      </p>
      <ul>
        <li>Full repository information (name, owner, description)</li>
        <li>Visibility badge and creation date</li>
        <li>Issue count (open and closed)</li>
        <li>
          <strong>Star</strong> and <strong>Pin</strong> buttons
        </li>
        <li>Issue management links</li>
        <li>Owner-only actions (edit, delete, visibility toggle)</li>
      </ul>

      <h2 id="starring-and-pinning" className="heading-anchor">
        Starring &amp; Pinning
      </h2>
      <h3>Starring</h3>
      <p>
        Starring a repository is a way to show appreciation or bookmark it for
        later. To star a repository:
      </p>
      <ol>
        <li>Navigate to any public repository.</li>
        <li>Click the <strong>Star</strong> button.</li>
        <li>The star count increments immediately.</li>
      </ol>
      <p>
        You can view all your starred repositories from the user menu or by
        navigating to <code>/user/[userId]/starred</code>.
      </p>

      <h3>Pinning</h3>
      <p>
        Pinned repositories are displayed prominently on your public profile.
        This is a great way to showcase your best work.
      </p>
      <ol>
        <li>Navigate to a repository you own.</li>
        <li>Click the <strong>Pin</strong> button.</li>
        <li>
          The repository will appear in the Pinned Repositories section of your
          profile.
        </li>
      </ol>
      <Callout type="tip">
        Only repositories you own can be pinned. You can have multiple pinned
        repositories, and they will be displayed in a grid on your profile page.
      </Callout>
    </>
  );
}
