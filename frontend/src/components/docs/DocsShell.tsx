"use client";

import { type ReactNode } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTOC } from "./DocsTOC";
import { Breadcrumb } from "./Breadcrumb";
import type { TOCItem } from "@/lib/docs-nav";

interface DocsShellProps {
  children: ReactNode;
  toc?: TOCItem[];
}

export function DocsShell({ children, toc = [] }: DocsShellProps) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
      <DocsSidebar />
      <main className="min-w-0 flex-1 py-8">
        <Breadcrumb />
        <article className="prose-config max-w-3xl">{children}</article>
      </main>
      <DocsTOC items={toc} />
    </div>
  );
}
