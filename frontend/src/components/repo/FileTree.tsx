"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { FileTreeEntry } from "@/types/models";

interface FileTreeProps {
  tree: FileTreeEntry[];
  selectedPath: string | null;
  onFileSelect: (path: string) => void;
}

function FileTreeItem({
  item,
  depth,
  selectedPath,
  onFileSelect,
}: {
  item: FileTreeEntry;
  depth: number;
  selectedPath: string | null;
  onFileSelect: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);

  if (item.type === "dir") {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-1.5 px-2 py-1 text-xs text-muted hover:text-primary transition-colors rounded hover:bg-glass-hover"
          style={{ paddingLeft: `${8 + depth * 16}px` }}
        >
          <svg
            className={cn("size-3 shrink-0 transition-transform", expanded && "rotate-90")}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <svg className="size-4 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v1H2V6z" />
            <path d="M2 9h20v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
          </svg>
          <span>{item.name}</span>
        </button>
        {expanded && item.children?.map((child) => (
          <FileTreeItem
            key={child.path}
            item={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    );
  }

  const ext = item.name.split(".").pop()?.toLowerCase() || "";
  const iconColor =
    ["ts", "tsx", "js", "jsx"].includes(ext) ? "text-yellow-400" :
    ["css", "scss", "less"].includes(ext) ? "text-pink-400" :
    ["json", "yaml", "yml", "toml"].includes(ext) ? "text-orange-400" :
    ["md", "mdx"].includes(ext) ? "text-blue-400" :
    ["html"].includes(ext) ? "text-red-400" :
    "text-subtle";

  return (
    <button
      onClick={() => onFileSelect(item.path)}
      className={cn(
        "flex w-full items-center gap-1.5 px-2 py-1 text-xs transition-colors rounded",
        selectedPath === item.path
          ? "bg-accent/10 text-accent"
          : "text-muted hover:text-primary hover:bg-glass-hover",
      )}
      style={{ paddingLeft: `${8 + depth * 16}px` }}
    >
      <svg className={cn("size-4 shrink-0", iconColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span>{item.name}</span>
    </button>
  );
}

export function FileTree({ tree, selectedPath, onFileSelect }: FileTreeProps) {
  if (tree.length === 0) {
    return (
      <div className="px-3 py-8 text-center text-xs text-subtle">
        <p>No files in this repository</p>
        <p className="mt-1">Use the CLI to push code</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {tree.map((item) => (
        <FileTreeItem
          key={item.path}
          item={item}
          depth={0}
          selectedPath={selectedPath}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
}
