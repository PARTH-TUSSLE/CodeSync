import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CalloutProps {
  type: "tip" | "note" | "warning";
  title?: string;
  children: ReactNode;
}

const styles = {
  tip: {
    container: "border-emerald/30 bg-emerald/5",
    icon: "text-emerald",
    title: "text-emerald",
  },
  note: {
    container: "border-accent/30 bg-accent/5",
    icon: "text-accent",
    title: "text-accent",
  },
  warning: {
    container: "border-amber/30 bg-amber/5",
    icon: "text-amber",
    title: "text-amber",
  },
};

const icons = {
  tip: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  note: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
};

export function Callout({ type, title, children }: CalloutProps) {
  const s = styles[type];
  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 pl-11",
        s.container,
      )}
    >
      <span className="absolute left-3.5 top-4">{icons[type]}</span>
      {title && (
        <p className={cn("mb-1 text-sm font-semibold", s.title)}>{title}</p>
      )}
      <div className="text-sm leading-relaxed text-muted [&_code]:text-xs [&_code]:font-medium [&_code]:text-primary">
        {children}
      </div>
    </div>
  );
}
