"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FaultyTerminal = dynamic(
  () => import("@/components/backgrounds/FaultyTerminal"),
  { ssr: false },
);

const stats = [
  { label: "Repositories", value: "10,000+" },
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

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24 text-center">
        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5">
            <span className="flex size-1.5 rounded-full bg-emerald-400/80 animate-glow-pulse-fast" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-accent">
              Beta — Now available
            </span>
          </div>
        </div>

        <h1 className="heading-xl text-balance mx-auto max-w-5xl">
          Version control
          <br />
          <span className="text-gradient">reimagined</span>
          <br />
          for the modern era
        </h1>

        <p className="body-lg mx-auto mt-8 max-w-xl text-balance">
          Git-inspired workflows, beautiful issue tracking, and
          contribution insights — all in a platform built for how
          developers actually work.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-primary px-7 text-sm font-semibold tracking-[-0.01em] text-surface transition-all hover:opacity-90"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started Free
          </Link>
          <Link
            href="/repos"
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-glass-border bg-white/5 px-7 text-sm font-medium tracking-[-0.01em] text-primary backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Explore Repos
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 sm:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none tracking-[-0.03em] text-primary">
                {stat.value}
              </div>
              <div className="mt-2 text-xs font-medium tracking-[0.08em] uppercase text-subtle/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-subtle/50">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">Scroll</span>
          <svg
            className="size-3.5 animate-float"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
