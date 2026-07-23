"use client";

import { useEffect, useRef, useState } from "react";

const screens = [
  {
    id: "dashboard",
    label: "Dashboard",
    gradient: "from-accent/20 via-accent/5 to-transparent",
  },
  {
    id: "repo",
    label: "Repository",
    gradient: "from-emerald/20 via-emerald/5 to-transparent",
  },
  {
    id: "issues",
    label: "Issues",
    gradient: "from-amber/20 via-amber/5 to-transparent",
  },
];

export function LandingShowcase() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [visible]);

  return (
    <section
      ref={ref}
      className="relative z-10 border-t border-glass-border bg-surface py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="section-label justify-center">Product</div>
          <h2 className="heading-lg text-balance">
            Everything at a
            <br />
            <span className="text-gradient">single glance</span>
          </h2>
          <p className="body-lg mt-5 text-balance">
            A unified interface for managing repositories, tracking issues,
            and monitoring your team&rsquo;s progress.
          </p>
        </div>

        <div
          className={`relative mx-auto max-w-5xl transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          {/* Browser chrome */}
          <div className="overflow-hidden rounded-2xl border border-glass-border bg-surface-elevated shadow-2xl shadow-black/10 dark:shadow-black/30">
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-glass-border px-5 py-3.5">
              <div className="flex gap-2">
                <div className="size-2.5 rounded-full bg-red-400/60" />
                <div className="size-2.5 rounded-full bg-amber-400/60" />
                <div className="size-2.5 rounded-full bg-emerald-400/60" />
              </div>
              <div className="ml-2 flex-1">
                <div className="mx-auto max-w-md rounded-md bg-surface-secondary px-3 py-1.5 text-center">
                  <span className="text-xs font-medium tracking-[-0.01em] text-muted">
                    app.codesync.dev
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0.5 border-b border-glass-border bg-surface-secondary/50 px-4">
              {screens.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${
                    i === active
                      ? "text-primary"
                      : "text-muted/60 hover:text-muted"
                  }`}
                >
                  {s.label}
                  {i === active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Screenshot placeholder */}
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              {screens.map((s, i) => (
                <div
                  key={s.id}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                    i === active
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0 pointer-events-none"
                  }`}
                >
                  <div
                    className={`mx-8 flex h-full w-full flex-col items-center justify-center bg-gradient-to-b ${s.gradient}`}
                  >
                    {/* Floating UI elements to suggest the interface */}
                    <div className="flex w-full max-w-2xl flex-col gap-4 px-8">
                      {/* Top bar suggestion */}
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg border border-glass-border bg-surface-elevated/50" />
                        <div className="h-3 w-48 rounded-full bg-surface-tertiary/50" />
                        <div className="ml-auto flex gap-2">
                          <div className="size-8 rounded-lg border border-glass-border bg-surface-elevated/50" />
                          <div className="size-8 rounded-lg border border-glass-border bg-surface-elevated/50" />
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {[...Array(6)].map((_, j) => (
                          <div
                            key={j}
                            className="rounded-xl border border-glass-border bg-surface-elevated/30 p-4"
                          >
                            <div className="mb-3 size-8 rounded-lg bg-accent/10" />
                            <div className="mb-2 h-3 w-3/4 rounded-full bg-surface-tertiary/50" />
                            <div className="h-2 w-full rounded-full bg-surface-tertiary/30" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <span className="absolute bottom-8 text-xs font-medium tracking-[0.08em] uppercase text-muted/40">
                      {s.id === "dashboard" && "Repository overview"}
                      {s.id === "repo" && "Source code browser"}
                      {s.id === "issues" && "Issue tracker"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {screens.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-8 bg-accent"
                    : "w-2 bg-glass-border hover:bg-glass-border-hover"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
