"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useState } from "react";

export function LandingNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isPublic =
    pathname === "/login" || pathname === "/signup";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-glass-border bg-surface/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-bold tracking-[-0.03em] text-primary">
            Code<span className="text-accent">Sync</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/docs"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium tracking-[-0.01em] text-muted transition-colors hover:text-primary sm:inline-block"
          >
            Docs
          </Link>
          <Link
            href="/repos"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium tracking-[-0.01em] text-muted transition-colors hover:text-primary sm:inline-block"
          >
            Explore
          </Link>

          {isAuthenticated ? (
            <div className="relative ml-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full focus:outline-none"
              >
                <Avatar
                  src={user?.profilePic}
                  username={user?.username ?? "U"}
                  size="sm"
                />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-glass-border bg-surface-elevated/95 backdrop-blur-2xl shadow-lg">
                    <div className="border-b border-glass-border px-4 py-2.5 text-sm font-semibold tracking-[-0.01em] text-primary">
                      {user?.username}
                    </div>
                    {[
                      { label: "Profile", href: `/profile/${user?.id}` },
                      { label: "My Repos", href: `/user/${user?.id}/repos` },
                      { label: "Starred", href: `/user/${user?.id}/starred` },
                      { label: "Contributions", href: `/profile/${user?.id}/contributions` },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-glass-hover hover:text-primary"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-glass-border">
                      <button
                        onClick={() => { setMenuOpen(false); logout(); }}
                        className="block w-full px-4 py-2 text-left text-sm font-medium text-warm transition-colors hover:bg-glass-hover"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="ml-3 flex items-center gap-2">
              {!isPublic && (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium tracking-[-0.01em] text-muted transition-colors hover:text-primary"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary !rounded-lg !px-4 !py-1.5 text-xs font-semibold"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
