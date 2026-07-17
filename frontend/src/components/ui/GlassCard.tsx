"use client";

import { cn } from "@/lib/cn";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  as?: "div" | "section" | "article";
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  as: Tag = "div",
  onClick,
}: GlassCardProps) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "glass-card p-6",
        hover && "glass-hover",
        glow && "glow-accent",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
