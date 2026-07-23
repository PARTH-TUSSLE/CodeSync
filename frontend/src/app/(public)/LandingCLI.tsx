"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const commands = [
  {
    cmd: "codesync init",
    output: "Initialized empty CodeSync repository in ~/project/.codesync",
  },
  {
    cmd: "codesync add .",
    output: "Staged 12 files for commit",
  },
  {
    cmd: 'codesync commit -m "feat: add auth"',
    output: "[main 1a2b3c4d] feat: add authentication layer\n 8 files changed, 243 insertions(+), 12 deletions(-)",
  },
  {
    cmd: "codesync push",
    output: "Pushing 2 commits to remote...\n✓ Repository synced successfully",
  },
];

export function LandingCLI() {
  const [activeCmd, setActiveCmd] = useState(0);
  const [typing, setTyping] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSectionVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionVisible) return;

    const runCommand = async (index: number) => {
      const cmd = commands[index];
      setActiveCmd(index);
      setShowOutput(false);
      setTyping("");

      for (let i = 0; i <= cmd.cmd.length; i++) {
        await new Promise((r) => setTimeout(r, 35));
        setTyping(cmd.cmd.slice(0, i));
      }

      await new Promise((r) => setTimeout(r, 400));
      setShowOutput(true);
      await new Promise((r) => setTimeout(r, 2000));

      if (index < commands.length - 1) {
        await runCommand(index + 1);
      } else {
        setTimeout(() => runCommand(0), 2500);
      }
    };

    const timer = setTimeout(() => runCommand(0), 600);
    return () => clearTimeout(timer);
  }, [sectionVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 border-t border-glass-border bg-surface-secondary py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="section-label justify-center">Terminal</div>
          <h2 className="heading-lg text-balance">
            A CLI that feels
            <br />
            <span className="text-gradient">like home</span>
          </h2>
          <p className="body-lg mt-5 text-balance">
            Git-inspired commands. Zero learning curve. The same workflow
            you already know, adapted for CodeSync.
          </p>
        </div>

        <div
          className={`mx-auto max-w-3xl transition-all duration-1000 ${
            sectionVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          {/* Terminal window */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a12] shadow-2xl shadow-black/40">
            {/* Title bar */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3">
              <div className="flex gap-2">
                <div className="size-2.5 rounded-full bg-[#ff5f56]" />
                <div className="size-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="size-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="ml-2 text-xs font-mono text-white/30">
                codesync@dev — ~/project
              </span>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div className="mb-1 flex items-center gap-2 text-white/40">
                <span>$</span>
                <span className="text-white/50">cd project &amp;&amp; codesync start</span>
              </div>
              <div className="mb-5 text-white/40">✓ Server running on port 3000</div>

              {commands.map((cmd, i) => (
                <div
                  key={cmd.cmd}
                  className={`mb-4 transition-opacity duration-500 ${
                    i > activeCmd ? "opacity-15" : "opacity-100"
                  }`}
                >
                  {i < activeCmd ? (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400/80 shrink-0">$</span>
                        <span className="text-white/90">{cmd.cmd}</span>
                      </div>
                      <div className="mt-1.5 whitespace-pre-line pl-6 text-white/50">
                        {cmd.output}
                      </div>
                    </>
                  ) : i === activeCmd ? (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400/80 shrink-0">$</span>
                        <span className="text-white/90">{typing}</span>
                        {!showOutput && (
                          <span className="inline-block h-4 w-2 animate-terminal-blink bg-white/70" />
                        )}
                      </div>
                      {showOutput && (
                        <div className="mt-1.5 animate-fade-in whitespace-pre-line pl-6 text-emerald-400/70">
                          {cmd.output}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-start gap-2">
                      <span className="text-white/20 shrink-0">$</span>
                      <span className="text-white/20">{cmd.cmd}</span>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2 text-white/40">
                <span>$</span>
                <span className="inline-block h-4 w-2 animate-terminal-blink bg-white/70" />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/docs/cli"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-soft"
            >
              Read the CLI guide
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
