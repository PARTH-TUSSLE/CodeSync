"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";

const navItems = [
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    href: "/profile/edit",
    label: "Edit Profile",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
  },
  {
    href: "/profile/password",
    label: "Password",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    href: "/profile/contributions",
    label: "Contributions",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    href: "/profile/cli-token",
    label: "CLI Token",
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const userId = user?.id;
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!userId) return null;

  const links = navItems.map((item) => ({
    ...item,
    href: item.href.replace("/profile", `/profile/${userId}`),
  }));

  const isActive = (href: string) => {
    if (href === `/profile/${userId}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebar = (
    <nav className="flex flex-col gap-1" role="navigation" aria-label="Profile navigation">
      {user && (
        <div className="mb-3 flex items-center gap-3 border-b border-glass-border px-3 pb-4">
          <Avatar
            src={user.profilePic}
            username={user.username}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-primary">
              {user.username}
            </p>
            <p className="truncate text-xs text-muted">
              {user.email}
            </p>
          </div>
        </div>
      )}
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-accent-glow text-accent shadow-sm"
                : "text-muted hover:bg-glass-hover hover:text-primary",
            )}
          >
            <span className={cn(
              "shrink-0",
              active ? "text-accent" : "text-subtle",
            )}>
              {link.icon}
            </span>
            {link.label}
            {active && (
              <span className="ml-auto block size-1.5 rounded-full bg-accent" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        className={cn(
          "flex items-center gap-2 text-sm font-medium text-muted hover:text-primary md:hidden",
          "mb-4 rounded-xl border border-glass-border bg-surface-elevated px-4 py-2.5 transition-colors",
        )}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-expanded={mobileOpen}
        aria-label="Toggle profile navigation"
      >
        <svg
          className={cn(
            "size-4 transition-transform duration-200",
            mobileOpen && "rotate-90",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Profile Menu
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-300 md:hidden",
        mobileOpen ? "mb-4 max-h-96 opacity-100" : "max-h-0 opacity-0",
      )}>
        {sidebar}
      </div>
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-20">
          {sidebar}
        </div>
      </aside>
    </>
  );
}
