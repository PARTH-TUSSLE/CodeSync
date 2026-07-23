"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
    title: "Version Control",
    description:
      "Full Git-inspired version control with staging, commits, push, pull, and revert. The commands you already know, adapted for CodeSync.",
    detail: "Initialize a repository with codesync init, stage changes with codesync add, commit with a message, and push to remote. The entire workflow is designed to feel instantly familiar.",
    isReversed: false,
  },
  {
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    title: "Issue Tracking",
    description:
      "Track bugs, features, and tasks with a clean issue system. Filter by status, search across repositories, and close issues when resolved.",
    detail: "Every issue has a title, description, and status. Filter by open or closed, toggle status with one click, and keep the full history of every discussion.",
    isReversed: true,
  },
  {
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Contribution Insights",
    description:
      "Visualize your activity with a GitHub-style contribution heatmap. See your coding patterns across days, months, and years.",
    detail: "Every commit, push, issue, and star is tracked. Your profile shows a beautiful heatmap with yearly views, hover tooltips, and total contribution counts.",
    isReversed: false,
  },
  {
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: "Starring & Pinning",
    description:
      "Star repositories you admire and pin your best work to your profile. Showcase what matters most.",
    detail: "Star any public repository to bookmark it. Pin your own repositories to feature them prominently on your profile page for visitors to discover.",
    isReversed: true,
  },
];

export function LandingFeatures() {
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setInterval(() => {
            setVisibleRows((prev) => {
              if (prev.length >= features.length) {
                clearInterval(timer);
                return prev;
              }
              return [...prev, prev.length];
            });
          }, 200);
        }
      },
      { threshold: 0.05 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 border-t border-glass-border bg-surface py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <div className="section-label justify-center">Capabilities</div>
          <h2 className="heading-lg text-balance">
            Everything you need,
            <br />
            <span className="text-gradient">nothing you don&rsquo;t</span>
          </h2>
          <p className="body-lg mt-5 text-balance">
            Carefully designed features that solve real problems.
            No bloat. No complexity. Just tools that work.
          </p>
        </div>

        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, i) => {
            const visible = visibleRows.includes(i);

            return (
              <div
                key={feature.title}
                className={`flex flex-col gap-12 transition-all duration-700 lg:flex-row lg:items-center lg:gap-16 ${
                  feature.isReversed ? "lg:flex-row-reverse" : ""
                } ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
              >
                <div className="flex-1">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
                    {feature.icon}
                  </div>
                  <h3 className="heading-md mb-4">{feature.title}</h3>
                  <p className="body-lg mb-4">{feature.description}</p>
                  <p className="body-sm text-subtle">{feature.detail}</p>
                </div>

                <div className="flex-1">
                  <div className="overflow-hidden rounded-2xl border border-glass-border bg-surface-elevated p-8 shadow-lg">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`size-3 rounded-full ${
                          i === 0 ? "bg-emerald-400/40" : i === 1 ? "bg-accent/40" : i === 2 ? "bg-amber-400/40" : "bg-accent/40"
                        }`} />
                        <div className="h-2.5 w-32 rounded-full bg-surface-tertiary/50" />
                        <div className="ml-auto flex gap-1.5">
                          <div className={`size-7 rounded-md border border-glass-border ${i % 2 === 0 ? "bg-accent/5" : "bg-surface-tertiary/30"}`} />
                          <div className={`size-7 rounded-md border border-glass-border ${i % 2 === 0 ? "bg-accent/5" : "bg-surface-tertiary/30"}`} />
                        </div>
                      </div>
                      {[1, 2, 3].map((row) => {
                        const colors = ["text-emerald bg-emerald/10", "text-amber bg-amber/10", "text-accent bg-accent/10"];
                        const labels = ["Open", "Closed", "Active"];
                        const bgColors = ["bg-accent/10", "bg-emerald/10", "bg-amber/10"];
                        return (
                          <div key={row} className="flex items-center gap-3 rounded-lg border border-glass-border bg-surface-secondary/50 p-3">
                            <div className={`size-8 rounded-lg ${bgColors[i % 3]}`} />
                            <div className="flex-1 space-y-1.5">
                              <div className="h-2.5 w-3/4 rounded-full bg-surface-tertiary/50" />
                              <div className="h-2 w-1/2 rounded-full bg-surface-tertiary/30" />
                            </div>
                            <div className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${colors[row - 1]}`}>
                              {labels[row - 1]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
