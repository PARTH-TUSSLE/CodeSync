import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { logActivity } from "../utils/activityLogger.js";
import { s3, S3_BUCKET } from "../config/aws-config.js";
import { diffLines } from "diff";
const archiver: any = require("archiver");

const MAX_INLINE_SIZE = 100 * 1024;

interface TreeEntry {
  name: string;
  type: "file" | "dir";
  path: string;
  size?: number;
  children?: TreeEntry[];
}

async function ensureDefaultBranch(repoId: string): Promise<string> {
  const repo = await prisma.repository.findUnique({
    where: { id: repoId },
    select: { defaultBranch: true },
  });
  if (!repo) throw new Error("Repository not found");
  return repo.defaultBranch;
}

function parseFileTree(
  files: Array<{ filename?: string; size?: number }>,
  prefix: string,
): TreeEntry[] {
  const tree: TreeEntry[] = [];
  const dirMap = new Map<string, TreeEntry>();

  for (const f of files) {
    const filename = String(f.filename);
    const size = Number(f.size);
    if (!filename.startsWith(prefix)) continue;
    const relativePath = prefix ? filename.slice(prefix.length) : filename;
    const parts = relativePath.split("/").filter(Boolean);
    if (parts.length === 0) continue;

    if (parts.length === 1) {
      tree.push({ name: parts[0]! as string, type: "file", path: filename, size });
    } else {
      const dirName = parts[0]! as string;
      if (!dirMap.has(dirName)) {
        const entry: TreeEntry = {
          name: dirName,
          type: "dir",
          path: prefix + dirName + "/",
          children: [],
        };
        dirMap.set(dirName, entry);
        tree.push(entry);
      }
      const remaining = parts.slice(1).join("/");
      const entry = dirMap.get(dirName)!;
      if (!remaining.includes("/")) {
        entry.children!.push({
          name: remaining,
          type: "file",
          path: filename,
          size,
        });
      }
    }
  }

  tree.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of tree) {
    if (entry.type === "dir" && entry.children) {
      entry.children.sort((a, b) => {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }
  }

  return tree;
}

export const createCommit = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const userId = req.userId;
  const { branch: branchName, message, parentCommitId, files } = req.body;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  if (!message || !files || !Array.isArray(files)) {
    return res.status(400).json({ msg: "Fields message and files are required" });
  }

  try {
    const repo = await prisma.repository.findUnique({ where: { id: repoId } });
    if (!repo) {
      return res.status(404).json({ msg: "Repository not found" });
    }

    const access = await prisma.repoAccess.findUnique({
      where: { userId_repositoryId: { userId, repositoryId: repoId } },
    });
    if (repo.ownerId !== userId && (!access || access.role === "read")) {
      return res.status(403).json({ msg: "Forbidden: you do not have write access" });
    }

    const targetBranch = branchName || repo.defaultBranch;
    let branch = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: targetBranch } },
    });
    if (!branch) {
      branch = await prisma.branch.create({
        data: {
          name: targetBranch,
          repositoryId: repoId,
          authorId: userId,
          isDefault: targetBranch === repo.defaultBranch,
        },
      });
    }

    const commit = await prisma.commit.create({
      data: {
        message,
        branchId: branch.id,
        repositoryId: repoId,
        authorId: userId,
        parentCommitId: parentCommitId || null,
      },
    });

    const createdFiles: Array<{ id: string; filename: string; size: number; additions: number; deletions: number }> = [];

    for (const file of files) {
      const filename: string = file.filename || file.name || "";
      if (!filename) continue;
      const content: string = file.content || "";
      const size = content.length;

      let s3Key: string | null = null;
      let inlineContent: string | null = null;

      if (size > MAX_INLINE_SIZE) {
        s3Key = `commits/${repoId}/${commit.id}/${filename}`;
        await s3
          .upload({ Bucket: S3_BUCKET, Key: s3Key, Body: content })
          .promise();
      } else {
        inlineContent = content;
      }

      let additions = size;
      let deletions = 0;

      if (parentCommitId) {
        const parentFile = await prisma.commitFile.findFirst({
          where: { commitId: parentCommitId, filename },
          orderBy: { id: "desc" },
        });
        if (parentFile) {
          const parentContent = parentFile.content || "";
          const diffResult = diffLines(parentContent, content);
          additions = diffResult
            .filter((p: any) => p.added)
            .reduce((s: number, p: any) => s + (p.count || 0), 0);
          deletions = diffResult
            .filter((p: any) => p.removed)
            .reduce((s: number, p: any) => s + (p.count || 0), 0);
        }
      }

      const commitFile = await prisma.commitFile.create({
        data: {
          commitId: commit.id,
          filename,
          s3Key: s3Key || "",
          content: inlineContent,
          size,
          additions,
          deletions,
        },
      });

      createdFiles.push({
        id: commitFile.id,
        filename: commitFile.filename,
        size: commitFile.size,
        additions: commitFile.additions,
        deletions: commitFile.deletions,
      });
    }

    await logActivity(userId, "COMMIT", {
      commitId: commit.id,
      message,
      repoId,
      branch: branch.name,
      filesCount: files.length,
    });
    await logActivity(userId, "PUSH", {
      commitId: commit.id,
      repoId,
      branch: branch.name,
      commitCount: 1,
    });

    return res.status(201).json({
      msg: "Commit created successfully",
      commit: {
        id: commit.id,
        message: commit.message,
        branch: branch.name,
        filesCount: createdFiles.length,
        createdAt: commit.createdAt,
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error creating commit", error: errMsg });
  }
};

export const getCommits = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const branchName = String(req.query.branch || "") || (await ensureDefaultBranch(repoId));
  const page = Math.max(1, parseInt(String(req.query.page)) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit)) || 30));
  const skip = (page - 1) * limit;

  try {
    const repo = await prisma.repository.findUnique({ where: { id: repoId } });
    if (!repo) {
      return res.status(404).json({ msg: "Repository not found" });
    }

    const branch = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: branchName } },
    });
    if (!branch) {
      return res.status(200).json({
        msg: "No commits yet",
        commits: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      });
    }

    const [commits, total] = await Promise.all([
      prisma.commit.findMany({
        where: { branchId: branch.id },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true } },
          files: { select: { id: true } },
        },
      }),
      prisma.commit.count({ where: { branchId: branch.id } }),
    ]);

    return res.status(200).json({
      msg: "Commits fetched successfully",
      commits: commits.map((c) => ({
        id: c.id,
        message: c.message,
        author: c.author,
        filesCount: c.files.length,
        createdAt: c.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching commits", error: errMsg });
  }
};

export const getCommitDetail = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const commitId = String(req.params.commitId);

  try {
    const commit = await prisma.commit.findUnique({
      where: { id: commitId },
      include: {
        author: { select: { id: true, username: true } },
        branch: { select: { name: true } },
        files: {
          select: { id: true, filename: true, size: true, additions: true, deletions: true },
        },
      },
    });

    if (!commit || commit.repositoryId !== repoId) {
      return res.status(404).json({ msg: "Commit not found" });
    }

    return res.status(200).json({
      msg: "Commit fetched successfully",
      commit: {
        id: commit.id,
        message: commit.message,
        author: commit.author,
        branch: commit.branch.name,
        parentCommitId: commit.parentCommitId,
        files: commit.files,
        createdAt: commit.createdAt,
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching commit", error: errMsg });
  }
};

export const getFileTree = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const branchName = String(req.query.branch || "") || (await ensureDefaultBranch(repoId));
  const prefix = String(req.query.path || "");

  try {
    const branch = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: branchName } },
    });
    if (!branch) {
      return res.status(200).json({ msg: "No files yet", tree: [] });
    }

    const latestCommit = await prisma.commit.findFirst({
      where: { branchId: branch.id },
      orderBy: { createdAt: "desc" },
      include: { files: { select: { filename: true, size: true } } },
    });

    if (!latestCommit) {
      return res.status(200).json({ msg: "No files yet", tree: [] });
    }

    const tree = parseFileTree(latestCommit.files, prefix);

    return res.status(200).json({
      msg: "File tree fetched successfully",
      tree,
      commit: { id: latestCommit.id, message: latestCommit.message },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching file tree", error: errMsg });
  }
};

export const getFileContent = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const branchName = String(req.query.branch || "") || (await ensureDefaultBranch(repoId));
  const filePath = String(req.query.path || "");

  if (!filePath) {
    return res.status(400).json({ msg: "Path query parameter is required" });
  }

  try {
    const branch = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: branchName } },
    });
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    const latestCommit = await prisma.commit.findFirst({
      where: { branchId: branch.id },
      orderBy: { createdAt: "desc" },
    });
    if (!latestCommit) {
      return res.status(404).json({ msg: "No commits yet" });
    }

    const commitFile = await prisma.commitFile.findFirst({
      where: { commitId: latestCommit.id, filename: filePath },
    });
    if (!commitFile) {
      return res.status(404).json({ msg: "File not found" });
    }

    let content = commitFile.content;
    if (!content && commitFile.s3Key) {
      const s3Obj = await s3
        .getObject({ Bucket: S3_BUCKET, Key: commitFile.s3Key })
        .promise();
      content = s3Obj.Body?.toString() || "";
    }

    const ext = filePath.split(".").pop() || "";
    const languageMap: Record<string, string> = {
      ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript",
      rs: "rust", py: "python", go: "go", java: "java", rb: "ruby",
      md: "markdown", json: "json", yaml: "yaml", yml: "yaml",
      html: "html", css: "css", scss: "scss", sql: "sql",
      sh: "bash", bash: "bash", zsh: "bash",
      c: "c", cpp: "cpp", h: "c", hpp: "cpp",
      toml: "toml", xml: "xml", php: "php", swift: "swift",
      kt: "kotlin", dart: "dart", lua: "lua", r: "r",
    };

    return res.status(200).json({
      msg: "File content fetched successfully",
      file: {
        filename: commitFile.filename,
        content,
        size: commitFile.size,
        language: languageMap[ext] || null,
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching file content", error: errMsg });
  }
};

export const getRawFile = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const branchName = String(req.query.branch || "") || (await ensureDefaultBranch(repoId));
  const filePath = String(req.query.path || "");

  if (!filePath) {
    return res.status(400).json({ msg: "Path query parameter is required" });
  }

  try {
    const branch = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: branchName } },
    });
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    const latestCommit = await prisma.commit.findFirst({
      where: { branchId: branch.id },
      orderBy: { createdAt: "desc" },
    });
    if (!latestCommit) {
      return res.status(404).json({ msg: "No commits yet" });
    }

    const commitFile = await prisma.commitFile.findFirst({
      where: { commitId: latestCommit.id, filename: filePath },
    });
    if (!commitFile) {
      return res.status(404).json({ msg: "File not found" });
    }

    let content = commitFile.content;
    if (!content && commitFile.s3Key) {
      const s3Obj = await s3
        .getObject({ Bucket: S3_BUCKET, Key: commitFile.s3Key })
        .promise();
      content = s3Obj.Body?.toString() || "";
    }

    res.setHeader("Content-Type", "text/plain");
    return res.status(200).send(content);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching raw file", error: errMsg });
  }
};

export const getCommitDiff = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const commitId = String(req.params.commitId);

  try {
    const commit = await prisma.commit.findUnique({
      where: { id: commitId },
      include: { files: true },
    });

    if (!commit || commit.repositoryId !== repoId) {
      return res.status(404).json({ msg: "Commit not found" });
    }

    let parentFiles: Array<{ filename: string; content: string | null; s3Key: string }> = [];
    if (commit.parentCommitId) {
      parentFiles = await prisma.commitFile.findMany({
        where: { commitId: commit.parentCommitId },
      });
    }

    const parentFileMap = new Map(parentFiles.map((f) => [f.filename, f.content || ""]));

    const diffs = await Promise.all(
      commit.files.map(async (file) => {
        let currentContent = file.content;
        if (!currentContent && file.s3Key) {
          const s3Obj = await s3
            .getObject({ Bucket: S3_BUCKET, Key: file.s3Key })
            .promise();
          currentContent = s3Obj.Body?.toString() || "";
        }

        const parentContent = parentFileMap.get(file.filename) || "";
        const isNew = !parentFileMap.has(file.filename);
        const isDeleted = currentContent === "" && parentFileMap.has(file.filename);

        let diffText: string;
        if (isNew) {
          diffText = (currentContent || "")
            .split("\n")
            .map((line: string) => `+${line}`)
            .join("\n");
        } else if (isDeleted) {
          diffText = parentContent
            .split("\n")
            .map((line: string) => `-${line}`)
            .join("\n");
        } else {
          const changes = diffLines(parentContent, currentContent || "");
          diffText = changes
            .map((part: any) => {
              const prefix = part.added ? "+" : part.removed ? "-" : " ";
              return (part.value as string)
                .split("\n")
                .map((line: string) => (line ? `${prefix}${line}` : ""))
                .join("\n");
            })
            .join("\n");
        }

        return {
          filename: file.filename,
          status: isNew ? "added" as const : isDeleted ? "deleted" as const : "modified" as const,
          additions: file.additions,
          deletions: file.deletions,
          diff: diffText,
        };
      }),
    );

    return res.status(200).json({
      msg: "Diff fetched successfully",
      commit: { id: commit.id, message: commit.message, createdAt: commit.createdAt },
      files: diffs,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error computing diff", error: errMsg });
  }
};

export const downloadRepoZip = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const branchName = String(req.query.branch || "") || (await ensureDefaultBranch(repoId));

  try {
    const repo = await prisma.repository.findUnique({
      where: { id: repoId },
      include: { owner: { select: { username: true } } },
    });
    if (!repo) {
      return res.status(404).json({ msg: "Repository not found" });
    }

    const branch = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: branchName } },
    });
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    const latestCommit = await prisma.commit.findFirst({
      where: { branchId: branch.id },
      orderBy: { createdAt: "desc" },
      include: { files: true },
    });
    if (!latestCommit) {
      return res.status(404).json({ msg: "No commits yet" });
    }

    const archive = archiver("zip", { zlib: { level: 9 } });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${repo.name}-${branchName}.zip"`);

    archive.pipe(res);

    for (const file of latestCommit.files) {
      let content = file.content;
      if (!content && file.s3Key) {
        const s3Obj = await s3.getObject({ Bucket: S3_BUCKET, Key: file.s3Key }).promise();
        content = s3Obj.Body?.toString() || "";
      }
      if (content !== undefined && content !== null) {
        archive.append(content, { name: file.filename });
      }
    }

    await archive.finalize();
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (!res.headersSent) {
      return res.status(500).json({ msg: "Error downloading zip", error: errMsg });
    }
  }
};

export const compareBranches = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const baseBranch = String(req.query.base || "");
  const headBranch = String(req.query.head || "");

  if (!baseBranch || !headBranch) {
    return res.status(400).json({ msg: "Query params 'base' and 'head' are required" });
  }

  try {
    const base = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: baseBranch } },
    });
    const head = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: headBranch } },
    });
    if (!base) return res.status(404).json({ msg: `Base branch '${baseBranch}' not found` });
    if (!head) return res.status(404).json({ msg: `Head branch '${headBranch}' not found` });

    const headCommit = await prisma.commit.findFirst({
      where: { branchId: head.id },
      orderBy: { createdAt: "desc" },
      include: { files: true },
    });

    const baseCommit = await prisma.commit.findFirst({
      where: { branchId: base.id },
      orderBy: { createdAt: "desc" },
      include: { files: true },
    });

    const headFiles = headCommit?.files || [];
    const baseFiles = baseCommit?.files || [];
    const baseFileMap = new Map(baseFiles.map((f) => [f.filename, f.content || ""]));

    const diffFiles: Array<{
      filename: string;
      status: "added" | "deleted" | "modified";
      additions: number;
      deletions: number;
      diff: string;
    }> = [];

    const processedFiles = new Set<string>();

    for (const file of headFiles) {
      processedFiles.add(file.filename);
      let content = file.content;
      if (!content && file.s3Key) {
        const s3Obj = await s3.getObject({ Bucket: S3_BUCKET, Key: file.s3Key }).promise();
        content = s3Obj.Body?.toString() || "";
      }

      const baseContent = baseFileMap.get(file.filename);
      if (baseContent === undefined) {
        diffFiles.push({
          filename: file.filename,
          status: "added",
          additions: file.size,
          deletions: 0,
          diff: (content || "").split("\n").map((l: string) => `+${l}`).join("\n"),
        });
      } else if (baseContent !== content) {
        const changes = diffLines(baseContent, content || "");
        const diffText = changes.map((part: any) => {
          const prefix = part.added ? "+" : part.removed ? "-" : " ";
          return (part.value as string).split("\n").map((l: string) => l ? `${prefix}${l}` : "").join("\n");
        }).join("\n");
        const additions = changes.filter((p: any) => p.added).reduce((s: number, p: any) => s + (p.count || 0), 0);
        const deletions = changes.filter((p: any) => p.removed).reduce((s: number, p: any) => s + (p.count || 0), 0);
        diffFiles.push({ filename: file.filename, status: "modified", additions, deletions, diff: diffText });
      }
    }

    for (const file of baseFiles) {
      if (!processedFiles.has(file.filename)) {
        diffFiles.push({
          filename: file.filename,
          status: "deleted",
          additions: 0,
          deletions: file.size,
          diff: (file.content || "").split("\n").map((l: string) => `-${l}`).join("\n"),
        });
      }
    }

    const headCommits = await prisma.commit.findMany({
      where: { branchId: head.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { author: { select: { username: true } } },
    });

    const aheadBy = headCommits.length;
    const behindBy = baseCommit ? await prisma.commit.count({ where: { branchId: base.id } }) : 0;

    return res.status(200).json({
      msg: "Comparison fetched successfully",
      baseBranch,
      headBranch,
      aheadBy,
      behindBy,
      files: diffFiles,
      commits: headCommits,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error comparing branches", error: errMsg });
  }
};
