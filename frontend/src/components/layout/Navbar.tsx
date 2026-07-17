"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { SearchInput } from "@/components/repo/SearchInput";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isPublic =
    pathname === "/login" || pathname === "/signup" || pathname === "/";

  return (
    <nav className="sticky top-0 z-50 border-b border-glass-border bg-surface/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-primary">
            Code<span className="text-accent">Sync</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <SearchInput />
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link href="/repos" className="nav-link">
                Explore
              </Link>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50"
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
                    <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-glass-border bg-surface-tertiary/95 backdrop-blur-2xl shadow-elevated">
                      <div className="border-b border-glass-border px-4 py-2.5 text-sm font-medium text-primary">
                        {user?.username}
                      </div>
                      <Link
                        href={`/profile/${user?.id}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted transition-colors hover:bg-glass-hover hover:text-primary"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href={`/user/${user?.id}/repos`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted transition-colors hover:bg-glass-hover hover:text-primary"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Repos
                      </Link>
                      <Link
                        href={`/user/${user?.id}/starred`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted transition-colors hover:bg-glass-hover hover:text-primary"
                        onClick={() => setMenuOpen(false)}
                      >
                        Starred
                      </Link>
                      <Link
                        href={`/profile/${user?.id}/contributions`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted transition-colors hover:bg-glass-hover hover:text-primary"
                        onClick={() => setMenuOpen(false)}
                      >
                        Contributions
                      </Link>
                      <div className="border-t border-glass-border">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-warm transition-colors hover:bg-glass-hover"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/repos" className="nav-link">
                Explore
              </Link>
              {!isPublic && (
                <>
                  <Link href="/login" className="nav-link">
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={cn(
                      "btn-primary !py-1.5 !px-4 text-xs",
                    )}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
