"use client";

import { useEffect, useRef, useState } from "react";

const commands = [
  { cmd: "codesync init", output: "Initialized empty CodeSync repository in ~/project/.codesync" },
  { cmd: "codesync status", output: "3 files changed, 42 insertions(+), 12 deletions(-)" },
  { cmd: "codesync push", output: "Syncing 2 commits to remote...\n✓ Repository synced successfully" },
  { cmd: "codesync log", output: "commit a1b2c3d4 - Fix memory leak in cache layer\ncommit e5f6g7h8 - Add user authentication middleware\ncommit i9j0k1l2 - Initial project setup" },
];

export function LandingTerminal() {
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
        await new Promise((r) => setTimeout(r, 40));
        setTyping(cmd.cmd.slice(0, i));
      }

      await new Promise((r) => setTimeout(r, 300));
      setShowOutput(true);
      await new Promise((r) => setTimeout(r, 1500));

      if (index < commands.length - 1) {
        await runCommand(index + 1);
      } else {
        setTimeout(() => runCommand(0), 2000);
      }
    };

    const timer = setTimeout(() => runCommand(0), 500);
    return () => clearTimeout(timer);
  }, [sectionVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 border-t border-glass-border bg-surface-secondary py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="section-header">
          <div className="section-badge">Terminal</div>
          <h2 className="section-title">
            Developer-first{" "}
            <span className="text-gradient">CLI experience</span>
          </h2>
          <p className="section-subtitle">
            Powerful command-line tools that integrate seamlessly with your
            existing workflow. No bloated GUI, just pure productivity.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div
            className={`overflow-hidden rounded-2xl border border-glass-border bg-[#0a0a12] shadow-2xl transition-all duration-700 ${
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center gap-2 border-b border-glass-border px-4 py-3">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-[#ff5f56]" />
                <div className="size-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="size-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="ml-3 text-xs font-mono text-subtle">
                codesync@dev — ~/project
              </span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed">
              {commands.map((cmd, i) => (
                <div key={cmd.cmd} className={`mb-3 ${i > activeCmd ? "opacity-20" : "opacity-100"}`}>
                  {i < activeCmd ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">$</span>
                        <span className="text-primary">{cmd.cmd}</span>
                      </div>
                      <div className="mt-1 whitespace-pre-line text-muted">
                        {cmd.output}
                      </div>
                    </>
                  ) : i === activeCmd ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">$</span>
                        <span className="text-primary">{typing}</span>
                        <span className="inline-block size-2 animate-terminal-blink bg-accent" />
                      </div>
                      {showOutput && (
                        <div className="mt-1 whitespace-pre-line text-muted">
                          {cmd.output}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-subtle">$</span>
                        <span className="text-subtle">{cmd.cmd}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
