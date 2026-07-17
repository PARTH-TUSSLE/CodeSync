"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  docs: "Docs",
  "getting-started": "Getting Started",
  repositories: "Repositories",
  issues: "Issues",
  profile: "Profile",
  cli: "CLI Guide",
  search: "Search",
  faq: "FAQ",
  troubleshooting: "Troubleshooting",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1) return null;

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    return {
      label: labelMap[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: i < segments.length - 1 ? href : undefined,
    };
  });

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <svg className="size-3.5 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
          {crumb.href ? (
            <Link href={crumb.href} className="transition-colors hover:text-primary">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-primary">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
