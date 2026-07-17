import Link from "next/link";
import { Callout } from "@/components/docs/Callout";

export default function SearchPage() {
  return (
    <>
      <h1>Search</h1>
      <p className="lead">
        CodeSync provides a fast, intuitive search experience to help you find
        repositories across the platform.
      </p>

      <hr />

      <h2 id="searching-repositories" className="heading-anchor">
        Searching Repositories
      </h2>
      <p>
        The search bar is available in the top navigation bar on every page.
        To search for repositories:
      </p>
      <ol>
        <li>
          Click on the search input in the navigation bar (or press{" "}
          <kbd>Ctrl+K</kbd> to focus it).
        </li>
        <li>
          Type all or part of a repository name. The search matches against
          repository names.
        </li>
        <li>
          Press <kbd>Enter</kbd> or wait for the debounced search to
          automatically navigate you to the search results page.
        </li>
      </ol>
      <Callout type="note">
        The search has a 400ms debounce to avoid excessive navigation. You can
        also press <kbd>Enter</kbd> to search immediately.
      </Callout>

      <h2 id="search-results" className="heading-anchor">
        Search Results
      </h2>
      <p>
        Search results are displayed on the dedicated search page at{" "}
        <code>/search?q=your-query</code>. The results page shows:
      </p>
      <ul>
        <li>
          <strong>Repository Cards</strong> — Each matching repository is
          displayed as a card with its name, owner, description, and creation
          date.
        </li>
        <li>
          <strong>Empty State</strong> — If no repositories match your query, a
          friendly message is shown instead.
        </li>
      </ul>

      <h3>What Gets Searched</h3>
      <p>
        Currently, CodeSync searches only public repository names. The search
        uses the backend API endpoint <code>/repo/name/:name</code> with the
        owner ID as an optional filter.
      </p>
      <ul>
        <li>
          <strong>Public repositories</strong> — All public repositories matching
          your query are returned.
        </li>
        <li>
          <strong>Private repositories</strong> — Private repositories where you
          are the owner are also included in search results.
        </li>
      </ul>

      <h2 id="keyboard-shortcuts" className="heading-anchor">
        Keyboard Shortcuts
      </h2>
      <div className="overflow-hidden rounded-xl border border-glass-border">
        <table className="command-table !m-0">
          <thead>
            <tr>
              <th>Shortcut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><kbd>/</kbd> or <kbd>Ctrl+K</kbd></td>
              <td>Focus the search bar</td>
            </tr>
            <tr>
              <td><kbd>Enter</kbd></td>
              <td>Submit search query</td>
            </tr>
            <tr>
              <td><kbd>Esc</kbd></td>
              <td>Clear search / close command palette</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="tip" title="Search Tips">
        <ul className="!mb-0">
          <li>Search is case-insensitive — <code>&ldquo;MyApp&rdquo;</code> and <code>&ldquo;myapp&rdquo;</code> return the same results.</li>
          <li>Search by partial names — <code>&ldquo;auth&rdquo;</code> will match <code>&ldquo;auth-service&rdquo;</code> and <code>&ldquo;my-auth-app&rdquo;</code>.</li>
          <li>Use the Explore page to browse all repositories if you are not looking for something specific.</li>
        </ul>
      </Callout>

      <h2 id="future-search-capabilities" className="heading-anchor">
        Coming Soon
      </h2>
      <p>
        CodeSync&rsquo;s search functionality is evolving. Planned improvements
        include:
      </p>
      <ul>
        <li>Search within repository contents and issues.</li>
        <li>Advanced filters (by owner, date range, stars count).</li>
        <li>User and profile search.</li>
        <li>Full-text search across all public repositories.</li>
      </ul>
    </>
  );
}
