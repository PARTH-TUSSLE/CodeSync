import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { logActivity } from "../utils/activityLogger.js";
import { s3, S3_BUCKET } from "../config/aws-config.js";
import { diffLines } from "diff";

const MAX_INLINE_SIZE = 100 * 1024;

async function ensureDefaultBranch(repoId: string): Promise<string> {
  const repo = await prisma.repository.findUnique({
    where: { id: repoId },
    select: { defaultBranch: true },
  });
  if (!repo) throw new Error("Repository not found");
  return repo.defaultBranch;
}

function parseFileTree(files: { filename: string; size: number }[], prefix: string) {
  const tree: { name: string; type: "dir"; path: string; children: any[] }[] = [];
  const dirMap = new Map<string, any>();

  for (const file of files) {
    if (!file.filename.startsWith(prefix)) continue;
    const relativePath = prefix ? file.filename.slice(prefix.length) : file.filename;
    const parts = relativePath.split("/").filter(Boolean);
    if (parts.length === 0) continue;

    if (parts.length === 1) {
      tree.push({ name: parts[0], type: "file", path: file.filename, size: file.size });
    } else {
      const dirName = parts[0];
      if (!dirMap.has(dirName)) {
        const entry: any = { name: dirName, type: "dir", path: prefix + dirName + "/", children: [] };
        dirMap.set(dirName, entry);
        tree.push(entry);
      }
      const remaining = parts.slice(1).join("/");
      const entry = dirMap.get(dirName);
      if (!remaining.includes("/")) {
        entry.children.push({ name: remaining, type: "file", path: file.filename, size: file.size });
      }
    }
  }

  tree.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of tree) {
    if (entry.type === "dir" && entry.children) {
      entry.children.sort((a: any, b: any) => {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }
  }

  return tree;
}

export const createCommit = async (req: Request, res: Response) => {
  const { repoId } = req.params;
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

    let branch = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: branchName || repo.defaultBranch } },
    });
    if (!branch) {
      branch = await prisma.branch.create({
        data: {
          name: branchName || repo.defaultBranch,
          repositoryId: repoId,
          authorId: userId,
          isDefault: !branchName || branchName === repo.defaultBranch,
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

    const createdFiles: any[] = [];
    for (const file of files) {
      const filename: string = file.filename || file.name;
      const content: string = file.content || "";
      const size = content.length;

      let s3Key: string | null = null;
      let inlineContent: string | null = null;

      if (size > MAX_INLINE_SIZE) {
        s3Key = `commits/${repoId}/${commit.id}/${filename}`;
        await s3.upload({
          Bucket: S3_BUCKET,
          Key: s3Key,
          Body: content,
        }).promise();
      } else {
        inlineContent = content;
      }

      let additions = size;
      let deletions = 0;
      if (parentCommitId) {
        const parentFile = await prisma.commitFile.findFirst({
          where: {
            commitId: parentCommitId,
            filename,
          },
          orderBy: { id: "desc" },
        });
        if (parentFile) {
          const parentContent = parentFile.content || "";
          const diffResult = diffLines(parentContent, content);
          additions = diffResult.filter((p: any) => p.added).reduce((s: number, p: any) => s + p.count, 0);
          deletions = diffResult.filter((p: any) => p.removed).reduce((s: number, p: any) => s + p.count, 0);
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
      createdFiles.push(commitFile);
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
  const { repoId } = req.params;
  const branchName = (req.query.branch as string) || (await ensureDefaultBranch(repoId));
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 30));
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
      return res.status(200).json({ msg: "No commits yet", commits: [], total: 0, page, limit, totalPages: 0 });
    }

    const [commits, total] = await Promise.all([
      prisma.commit.findMany({
        where: { branchId: branch.id },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true } },
          _count: { select: { files: true } },
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
        filesCount: c._count.files,
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
  const { repoId, commitId } = req.params;

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
  const { repoId } = req.params;
  const branchName = (req.query.branch as string) || (await ensureDefaultBranch(repoId));
  const prefix = (req.query.path as string) || "";

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
      include: {
        files: { select: { filename: true, size: true } },
      },
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
  const { repoId } = req.params;
  const branchName = (req.query.branch as string) || (await ensureDefaultBranch(repoId));
  const filePath = req.query.path as string;

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
      const s3Obj = await s3.getObject({ Bucket: S3_BUCKET, Key: commitFile.s3Key }).promise();
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
  const { repoId } = req.params;
  const branchName = (req.query.branch as string) || (await ensureDefaultBranch(repoId));
  const filePath = req.query.path as string;

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
      const s3Obj = await s3.getObject({ Bucket: S3_BUCKET, Key: commitFile.s3Key }).promise();
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
  const { repoId, commitId } = req.params;

  try {
    const commit = await prisma.commit.findUnique({
      where: { id: commitId },
      include: {
        files: true,
      },
    });

    if (!commit || commit.repositoryId !== repoId) {
      return res.status(404).json({ msg: "Commit not found" });
    }

    let parentFiles: { filename: string; content: string | null; s3Key: string }[] = [];
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
          const s3Obj = await s3.getObject({ Bucket: S3_BUCKET, Key: file.s3Key }).promise();
          currentContent = s3Obj.Body?.toString() || "";
        }

        const parentContent = parentFileMap.get(file.filename) || "";
        const isNew = !parentFileMap.has(file.filename);
        const isDeleted = currentContent === "" && parentFileMap.has(file.filename);

        let diff: string;
        if (isNew) {
          diff = currentContent!.split("\n").map((line) => `+${line}`).join("\n");
        } else if (isDeleted) {
          diff = parentContent.split("\n").map((line) => `-${line}`).join("\n");
        } else {
          const changes = diffLines(parentContent, currentContent || "");
          diff = changes.map((part: any) => {
            const prefix = part.added ? "+" : part.removed ? "-" : " ";
            return (part.value as string).split("\n").map((line: string) => line ? `${prefix}${line}` : "").join("\n");
          }).join("\n");
        }

        return {
          filename: file.filename,
          status: isNew ? "added" : isDeleted ? "deleted" : "modified",
          additions: file.additions,
          deletions: file.deletions,
          diff,
        };
      }),
    );

    return res.status(200).json({
      msg: "Diff fetched successfully",
      commit: {
        id: commit.id,
        message: commit.message,
        createdAt: commit.createdAt,
      },
      files: diffs,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error computing diff", error: errMsg });
  }
};
