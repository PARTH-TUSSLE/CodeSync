export interface DocNavItem {
  title: string;
  href: string;
  icon?: string;
  children?: DocNavItem[];
}

export const docNavItems: DocNavItem[] = [
  {
    title: "Welcome",
    href: "/docs",
    icon: "Home",
  },
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: "Rocket",
    children: [
      { title: "Creating an Account", href: "/docs/getting-started#creating-an-account" },
      { title: "Signing In", href: "/docs/getting-started#signing-in" },
      { title: "Your First Repository", href: "/docs/getting-started#your-first-repository" },
      { title: "Navigating the Dashboard", href: "/docs/getting-started#navigating-the-dashboard" },
    ],
  },
  {
    title: "Repositories",
    href: "/docs/repositories",
    icon: "Folder",
    children: [
      { title: "Creating a Repository", href: "/docs/repositories#creating-a-repository" },
      { title: "Editing a Repository", href: "/docs/repositories#editing-a-repository" },
      { title: "Deleting a Repository", href: "/docs/repositories#deleting-a-repository" },
      { title: "Repository Visibility", href: "/docs/repositories#repository-visibility" },
      { title: "Browsing Repositories", href: "/docs/repositories#browsing-repositories" },
      { title: "Starring & Pinning", href: "/docs/repositories#starring-and-pinning" },
    ],
  },
  {
    title: "Issues",
    href: "/docs/issues",
    icon: "CircleDot",
    children: [
      { title: "Creating Issues", href: "/docs/issues#creating-issues" },
      { title: "Managing Issues", href: "/docs/issues#managing-issues" },
      { title: "Closing & Reopening", href: "/docs/issues#closing-and-reopening" },
    ],
  },
  {
    title: "Profile",
    href: "/docs/profile",
    icon: "User",
    children: [
      { title: "Updating Your Profile", href: "/docs/profile#updating-your-profile" },
      { title: "Changing Your Avatar", href: "/docs/profile#changing-your-avatar" },
      { title: "Viewing Contributions", href: "/docs/profile#viewing-contributions" },
      { title: "Account Settings", href: "/docs/profile#account-settings" },
    ],
  },
  {
    title: "CLI Guide",
    href: "/docs/cli",
    icon: "Terminal",
    children: [
      { title: "Overview", href: "/docs/cli#overview" },
      { title: "Authentication", href: "/docs/cli#authentication" },
      { title: "Commands", href: "/docs/cli#commands" },
      { title: "Troubleshooting", href: "/docs/cli#cli-troubleshooting" },
    ],
  },
  {
    title: "Search",
    href: "/docs/search",
    icon: "Search",
  },
  {
    title: "FAQ",
    href: "/docs/faq",
    icon: "HelpCircle",
  },
  {
    title: "Troubleshooting",
    href: "/docs/troubleshooting",
    icon: "AlertTriangle",
  },
];

export interface TOCItem {
  id: string;
  label: string;
  level: number;
}

export interface DocPageMeta {
  title: string;
  description: string;
  toc: TOCItem[];
  breadcrumb: { label: string; href?: string }[];
}
