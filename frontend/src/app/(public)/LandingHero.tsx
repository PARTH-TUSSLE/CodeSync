"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FaultyTerminal = dynamic(
  () => import("@/components/backgrounds/FaultyTerminal"),
  { ssr: false },
);

const stats = [
  { label: "Repos Created", value: "10,000+" },
  { label: "Issues Tracked", value: "50,000+" },
  { label: "Developers", value: "5,000+" },
];

export function LandingHero() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
      {mounted && (
        <div
          className="absolute inset-0"
          style={{
            zIndex: 0,
            ...(!isDark
              ? { filter: "invert(1) hue-rotate(180deg)", opacity: 0.75 }
              : {}),
          }}
        >
          <FaultyTerminal
            className="absolute inset-0"
            scale={0.9}
            gridMul={[2.5, 1]}
            digitSize={1.8}
            timeScale={isDark ? 0.25 : 0.3}
            scanlineIntensity={isDark ? 0.25 : 0.35}
            glitchAmount={isDark ? 0.4 : 0.25}
            flickerAmount={isDark ? 0.3 : 0.2}
            noiseAmp={isDark ? 0.6 : 0.35}
            chromaticAberration={isDark ? 0.003 : 0.002}
            curvature={0.12}
            tint="#00e5ff"
            mouseReact={true}
            mouseStrength={0.12}
            brightness={isDark ? 0.45 : 0.85}
            pageLoadAnimation={true}
          />
        </div>
      )}

      <div
        className="absolute inset-0 z-[1]"
        style={
          !isDark
            ? { background: "radial-gradient(ellipse at 50% 40%, rgba(0, 229, 255, 0.06) 0%, transparent 60%)" }
            : { background: "radial-gradient(ellipse at 50% 40%, rgba(0, 229, 255, 0.03) 0%, transparent 60%)" }
        }
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface z-[2]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <span className="flex size-1.5 rounded-full bg-emerald-400 animate-glow-pulse-fast" />
            <span className="font-mono">~/codesync</span>
          </div>
        </div>

        <h1 className="mb-6 text-6xl font-bold tracking-tight text-primary sm:text-7xl lg:text-8xl animate-slide-up">
          Code
          <span className="text-gradient">Sync</span>
        </h1>

        <p
          className="mx-auto mb-10 max-w-2xl text-lg text-muted sm:text-xl animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Git-inspired version control for the modern era.
          Sync your code, track issues, and visualize contributions
          with a beautifully crafted developer experience.
        </p>

        <div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Link href="/signup" className="btn-primary text-base !px-8 !py-4">
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Get Started Free
          </Link>
          <Link href="/repos" className="btn-secondary text-base !px-8 !py-4">
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Explore Repos
          </Link>
        </div>

        <div
          className="mt-16 grid grid-cols-3 gap-8 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-subtle">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-2 text-subtle">
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll
          </span>
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
