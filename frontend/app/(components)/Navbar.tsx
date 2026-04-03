"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  FolderGit2,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BookOpen,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState<string>("User");
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hideNavbar =
    pathname === "/" ||
    pathname === "/auth/login" ||
    pathname === "/auth/signup";

  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    if (storedUsername) setUsername(storedUsername);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isProfileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/user/profile", label: "Profile", icon: User },
    { href: "/docs", label: "Docs", icon: BookOpen },
  ];

  if (hideNavbar) return null;

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 500px; }
        }
        .dropdown-enter { animation: fadeInDown 0.18s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mobile-enter   { animation: slideDown  0.22s cubic-bezier(0.16,1,0.3,1) forwards; }

        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
          border-radius: 9999px;
        }
        .nav-link-hover:hover::after { transform: translateX(-50%) scaleX(1); }

        .avatar-ring:hover { box-shadow: 0 0 0 2px rgba(255,255,255,0.15), 0 0 16px rgba(255,255,255,0.08); }

        .logo-text {
          background: linear-gradient(135deg, #ffffff 0%, #d4d4d4 40%, #737373 70%, #ffffff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: logoShimmer 4s ease-in-out infinite;
        }
        @keyframes logoShimmer {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        .active-pill {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
          border: 1px solid rgba(255,255,255,0.12);
        }
      `}</style>

      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
            ? "bg-[#0a0a0a] border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.6)]"
            : "bg-[#0a0a0a] border-b border-white/[0.04]"
          }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* ── Logo ── */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 group select-none"
            >
              <div className="relative w-7 h-7 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-md group-hover:bg-white/20 transition-all duration-500" />
                <Image
                  src="/codeSyncLogo.svg"
                  alt="CodeSync"
                  width={28}
                  height={28}
                  className="relative brightness-0 invert opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 ease-out"
                />
              </div>
              <span className="logo-text text-[1.15rem] font-bold tracking-tight">
                CodeSync
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      relative nav-link-hover flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium
                      transition-all duration-200 ease-out
                      ${active
                        ? "active-pill text-white"
                        : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.05]"
                      }
                    `}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors duration-200 ${active ? "text-white" : "text-gray-600 group-hover:text-gray-300"
                        }`}
                    />
                    <span className="tracking-wide">{label}</span>
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-white/40 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Desktop User Menu ── */}
            <div className="hidden md:flex items-center" ref={dropdownRef}>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  className="
                    avatar-ring flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full
                    bg-white/[0.04] border border-white/[0.08]
                    hover:bg-white/[0.08] hover:border-white/[0.15]
                    transition-all duration-200 ease-out group
                  "
                >
                  {/* Avatar */}
                  <div className="
                    w-7 h-7 rounded-full flex items-center justify-center
                    text-[11px] font-bold text-white tracking-wider
                    bg-gradient-to-br from-neutral-600 to-neutral-800
                    border border-white/20 shadow-inner
                  ">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-medium text-gray-300 group-hover:text-white transition-colors duration-150 max-w-[100px] truncate">
                    {username}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180 text-gray-300" : ""
                      }`}
                  />
                </button>

                {/* ── Dropdown ── */}
                {isProfileOpen && (
                  <div className="dropdown-enter absolute right-0 mt-2 w-52 z-30 overflow-hidden rounded-xl border border-white/[0.08] bg-[#111111]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-[13px] font-semibold text-white truncate">{username}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 tracking-wide">Signed in</p>
                    </div>

                    <div className="py-1.5">
                      {[
                        { href: "/user/profile", icon: User, label: "Profile" },
                        { href: "/settings", icon: Settings, label: "Settings" },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setIsProfileOpen(false)}
                          className="
                            flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-400
                            hover:text-white hover:bg-white/[0.06]
                            transition-all duration-150 group/item
                          "
                        >
                          <Icon className="w-3.5 h-3.5 text-gray-600 group-hover/item:text-gray-300 transition-colors" />
                          {label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-white/[0.06] py-1.5">
                      <button
                        onClick={handleLogout}
                        className="
                          flex items-center gap-3 w-full px-4 py-2.5 text-[13px]
                          text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.08]
                          transition-all duration-150 group/logout
                        "
                      >
                        <LogOut className="w-3.5 h-3.5 group-hover/logout:translate-x-0.5 transition-transform duration-150" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="
                md:hidden p-2 rounded-lg text-gray-500
                hover:text-white hover:bg-white/[0.07]
                transition-all duration-200
              "
              aria-label="Toggle menu"
            >
              <div className={`transition-all duration-200 ${isMenuOpen ? "rotate-90 opacity-100" : "rotate-0 opacity-100"}`}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </div>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isMenuOpen && (
          <div className="mobile-enter md:hidden border-t border-white/[0.05] bg-[#0d0d0d]/95 backdrop-blur-xl overflow-hidden">
            <div className="px-3 py-3 flex flex-col gap-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                      transition-all duration-150
                      ${active
                        ? "active-pill text-white"
                        : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.05]"
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-white" : "text-gray-600"}`} />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Section */}
            <div className="mx-3 mb-3 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-900 border border-white/20 flex items-center justify-center text-sm font-bold text-white">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{username}</p>
                  <p className="text-xs text-gray-600">View profile</p>
                </div>
              </div>

              <div className="py-1">
                {[
                  { href: "/user/profile", icon: User, label: "Profile" },
                  { href: "/settings", icon: Settings, label: "Settings" },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-150"
                  >
                    <Icon className="w-4 h-4 text-gray-600" />
                    {label}
                  </Link>
                ))}

                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.07] transition-all duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
