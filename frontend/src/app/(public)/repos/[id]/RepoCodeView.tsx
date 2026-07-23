"use client";

import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "@/lib/api/urls";
import { BranchSelector } from "@/components/repo/BranchSelector";
import { FileTree } from "@/components/repo/FileTree";
import { CodeViewer } from "@/components/repo/CodeViewer";
import { ReadmeRenderer } from "@/components/repo/ReadmeRenderer";
import { EmptyState } from "@/components/ui/EmptyState";
import type { FileTreeEntry, FileContent } from "@/types/models";

interface RepoCodeViewProps {
  repoId: string;
  defaultBranch: string;
  isOwner: boolean;
  repoName: string;
}

export function RepoCodeView({ repoId, defaultBranch, isOwner, repoName }: RepoCodeViewProps) {
  const [branch, setBranch] = useState(defaultBranch);
  const [tree, setTree] = useState<FileTreeEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [latestCommit, setLatestCommit] = useState<{ id: string; message: string } | null>(null);

  const fetchTree = useCallback(async (b: string) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/repo/${repoId}/tree?branch=${encodeURIComponent(b)}`));
      if (res.ok) {
        const data = await res.json();
        setTree(data.tree || []);
        setLatestCommit(data.commit || null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    fetchTree(branch);
  }, [branch, fetchTree]);

  useEffect(() => {
    if (!selectedFile) {
      setFileContent(null);
      return;
    }
    async function loadFile() {
      try {
        const res = await fetch(
          apiUrl(`/repo/${repoId}/blob?branch=${encodeURIComponent(branch)}&path=${encodeURIComponent(selectedFile!)}`),
        );
        if (res.ok) {
          const data = await res.json();
          setFileContent(data.file || null);
        }
      } catch {
        // ignore
      }
    }
    loadFile();
  }, [repoId, branch, selectedFile]);

  const handleBranchChange = useCallback((newBranch: string) => {
    setBranch(newBranch);
    setSelectedFile(null);
    setFileContent(null);
  }, []);

  const handleFileSelect = useCallback((path: string) => {
    setSelectedFile(path);
  }, []);

  const isReadme =
    tree.some((item) => item.name.toLowerCase() === "readme.md" && item.type === "file") &&
    !selectedFile;

  return (
    <div className="mt-0 border-x border-b border-glass-border rounded-b-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-glass-border bg-surface-elevated px-4 py-2">
        <BranchSelector
          repoId={repoId}
          currentBranch={branch}
          onBranchChange={handleBranchChange}
        />
        {latestCommit && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted">
            <span className="truncate max-w-[200px]">{latestCommit.message}</span>
            <span className="font-mono text-subtle">{latestCommit.id.slice(0, 7)}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          {isOwner && (
            <a
              href={`/repos/${repoId}/commits`}
              className="text-xs text-muted hover:text-primary transition-colors"
            >
              {tree.length} files
            </a>
          )}
        </div>
      </div>

      <div className="flex min-h-[300px]">
        <div className="w-64 shrink-0 border-r border-glass-border overflow-y-auto max-h-[600px]">
          {loading ? (
            <div className="px-3 py-8 text-center text-xs text-subtle">Loading files...</div>
          ) : (
            <FileTree
              tree={tree}
              selectedPath={selectedFile}
              onFileSelect={handleFileSelect}
            />
          )}
        </div>

        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-xs text-subtle">Loading...</div>
          ) : fileContent ? (
            <CodeViewer file={fileContent} />
          ) : isReadme ? (
            <ReadmePlaceholder repoId={repoId} branch={branch} />
          ) : tree.length === 0 ? (
            <EmptyState
              title="No files yet"
              description={`Push code to ${repoName} using the CodeSync CLI to see files here.`}
              actionLabel="View Docs"
              actionHref="/docs/cli"
            />
          ) : (
            <div className="flex items-center justify-center h-48 text-xs text-subtle">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadmePlaceholder({ repoId, branch }: { repoId: string; branch: string }) {
  const [readmeContent, setReadmeContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      apiUrl(`/repo/${repoId}/blob?branch=${encodeURIComponent(branch)}&path=README.md`),
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.file?.content) setReadmeContent(d.file.content);
      })
      .catch(() => {});
  }, [repoId, branch]);

  if (!readmeContent) {
    return <div className="flex items-center justify-center h-48 text-xs text-subtle">Loading README...</div>;
  }

  return (
    <div className="min-h-[300px]">
      <ReadmeRenderer content={readmeContent} />
    </div>
  );
}
