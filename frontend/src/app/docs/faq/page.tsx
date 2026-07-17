import Link from "next/link";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";

const faqs = [
  {
    q: "What is CodeSync?",
    a: (
      <p>
        CodeSync is a Git-inspired version control platform that allows you to
        manage repositories, track issues, and collaborate on code. It includes
        both a web dashboard and a command-line interface (CLI) for managing
        your projects.
      </p>
    ),
  },
  {
    q: "Is CodeSync free?",
    a: (
      <p>
        Yes, CodeSync is currently free to use. You can create both public and
        private repositories, track issues, and use the CLI without any charges.
      </p>
    ),
  },
  {
    q: "How is CodeSync different from Git?",
    a: (
      <p>
        CodeSync is inspired by Git but is a separate platform with its own
        workflow. While Git is a distributed version control system, CodeSync
        provides a centralized platform with a web interface for managing
        repositories, tracking issues, and visualizing contributions. The CLI
        commands (init, add, commit, push, pull, revert) are designed to feel
        familiar to Git users.
      </p>
    ),
  },
  {
    q: "How do I get my CLI token?",
    a: (
      <>
        <p>
          You can find your CLI token in your account settings. Navigate to your{" "}
          <Link href="/docs/profile">profile</Link>, then click on{" "}
          <strong>CLI Token</strong> in the sidebar. You can view, copy, and
          follow setup instructions from there.
        </p>
        <p>Alternatively, you will see your token immediately after signing up.</p>
      </>
    ),
  },
  {
    q: "My token expired. What should I do?",
    a: (
      <p>
        JWT tokens expire after 7 days. If your token has expired, simply log
        in to the web dashboard, navigate to your{" "}
        <Link href="/docs/profile">CLI Token settings</Link>, and get a new
        token. Then run <code>codesync login &lt;new-token&gt;</code> to update
        your CLI credentials.
      </p>
    ),
  },
  {
    q: "Can I make a private repository public?",
    a: (
      <p>
        Yes. As the repository owner, you can toggle the visibility of your
        repository at any time from the repository page. Private repos can be
        made public, and public repos can be made private.
      </p>
    ),
  },
  {
    q: "Who can see my private repositories?",
    a: (
      <p>
        Currently, private repositories are only visible to you (the owner).
        They do not appear in search results or the Explore page. Collaborative
        access is planned for a future release.
      </p>
    ),
  },
  {
    q: "How do I delete my account?",
    a: (
      <p>
        Account deletion is available through the profile settings. Navigate to
        your profile and use the delete option. This will permanently remove
        your account and all associated data.
      </p>
    ),
  },
  {
    q: "What kind of contributions are tracked?",
    a: (
      <p>
        CodeSync tracks the following activities: creating repositories, making
        commits, pushing changes, creating issues, closing issues, and starring
        repositories. These are displayed on your profile as a contribution
        heatmap, similar to GitHub.
      </p>
    ),
  },
  {
    q: "Can I follow other users?",
    a: (
      <p>
        Following functionality is being developed. The backend endpoints for
        following and unfollowing users exist, and the feature will be available
        in the UI soon.
      </p>
    ),
  },
  {
    q: "How do I report a bug or request a feature?",
    a: (
      <p>
        You can create an issue in any public repository to report bugs or
        suggest features. For platform-level issues, please reach out through
        the project&rsquo;s support channels.
      </p>
    ),
  },
  {
    q: "Is there a limit on the number of repositories I can create?",
    a: (
      <p>
        There is currently no limit on the number of repositories you can
        create. Feel free to create as many as you need.
      </p>
    ),
  },
];

export default function FAQPage() {
  return (
    <>
      <h1>FAQ</h1>
      <p className="lead">
        Frequently asked questions about CodeSync. If you cannot find what you
        are looking for, check the{" "}
        <Link href="/docs/troubleshooting">Troubleshooting</Link> guide.
      </p>

      <hr />

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group overflow-hidden rounded-xl border border-glass-border transition-colors open:border-accent/30 open:bg-accent/5"
          >
            <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 text-sm font-medium text-primary transition-colors hover:bg-glass-hover [&::-webkit-details-marker]:hidden">
              <svg
                className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              {faq.q}
            </summary>
            <div className="border-t border-glass-border px-5 py-4 text-sm leading-relaxed text-muted">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <hr />

      <div className="rounded-xl border border-glass-border bg-surface-secondary p-6">
        <h3 className="!mt-0">Still have questions?</h3>
        <p className="text-sm text-muted">
          Check the <Link href="/docs/troubleshooting">Troubleshooting guide</Link>{" "}
          for solutions to common problems, or explore the{" "}
          <Link href="/docs">documentation</Link> for detailed guides on every
          feature.
        </p>
      </div>
    </>
  );
}
