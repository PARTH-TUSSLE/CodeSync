import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const getBranches = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);

  try {
    const repo = await prisma.repository.findUnique({ where: { id: repoId } });
    if (!repo) {
      return res.status(404).json({ msg: "Repository not found" });
    }

    const branches = await prisma.branch.findMany({
      where: { repositoryId: repoId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    const branchesWithLatestCommit = await Promise.all(
      branches.map(async (b) => {
        const latestCommit = await prisma.commit.findFirst({
          where: { branchId: b.id },
          orderBy: { createdAt: "desc" },
          select: { id: true, message: true, createdAt: true },
        });

        const commitCount = await prisma.commit.count({
          where: { branchId: b.id },
        });

        return {
          id: b.id,
          name: b.name,
          isDefault: b.isDefault,
          commitCount,
          latestCommit,
          createdAt: b.createdAt,
        };
      }),
    );

    return res.status(200).json({
      msg: "Branches fetched successfully",
      defaultBranch: repo.defaultBranch,
      branches: branchesWithLatestCommit,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching branches", error: errMsg });
  }
};

export const createBranch = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const userId = req.userId;
  const { name, sourceBranch } = req.body;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  if (!name) {
    return res.status(400).json({ msg: "Branch name is required" });
  }

  try {
    const repo = await prisma.repository.findUnique({ where: { id: repoId } });
    if (!repo) {
      return res.status(404).json({ msg: "Repository not found" });
    }

    const existing = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name } },
    });
    if (existing) {
      return res.status(409).json({ msg: "Branch already exists" });
    }

    const branch = await prisma.branch.create({
      data: { name, repositoryId: repoId, authorId: userId, isDefault: false },
    });

    if (sourceBranch) {
      const source = await prisma.branch.findUnique({
        where: { repositoryId_name: { repositoryId: repoId, name: sourceBranch } },
      });

      if (source) {
        const latestSourceCommit = await prisma.commit.findFirst({
          where: { branchId: source.id },
          orderBy: { createdAt: "desc" },
          include: { files: true },
        });

        if (latestSourceCommit) {
          const newCommit = await prisma.commit.create({
            data: {
              message: `Create branch '${name}' from '${sourceBranch}'`,
              branchId: branch.id,
              repositoryId: repoId,
              authorId: userId,
              parentCommitId: latestSourceCommit.id,
            },
          });

          for (const file of latestSourceCommit.files) {
            await prisma.commitFile.create({
              data: {
                commitId: newCommit.id,
                filename: file.filename,
                s3Key: file.s3Key,
                content: file.content,
                size: file.size,
                additions: file.additions,
                deletions: file.deletions,
              },
            });
          }
        }
      }
    }

    return res.status(201).json({
      msg: "Branch created successfully",
      branch: {
        id: branch.id,
        name: branch.name,
        isDefault: branch.isDefault,
        createdAt: branch.createdAt,
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error creating branch", error: errMsg });
  }
};

export const setDefaultBranch = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const branchName = String(req.params.branchName);
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const repo = await prisma.repository.findUnique({ where: { id: repoId } });
    if (!repo) {
      return res.status(404).json({ msg: "Repository not found" });
    }
    if (repo.ownerId !== userId) {
      return res.status(403).json({ msg: "Forbidden: only the owner can change the default branch" });
    }

    const branch = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: branchName } },
    });
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    await prisma.$transaction([
      prisma.branch.updateMany({
        where: { repositoryId: repoId, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.branch.update({
        where: { id: branch.id },
        data: { isDefault: true },
      }),
      prisma.repository.update({
        where: { id: repoId },
        data: { defaultBranch: branchName },
      }),
    ]);

    return res.status(200).json({
      msg: `Default branch changed to '${branchName}'`,
      defaultBranch: branchName,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error updating default branch", error: errMsg });
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const branchName = String(req.params.branchName);
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const branch = await prisma.branch.findUnique({
      where: { repositoryId_name: { repositoryId: repoId, name: branchName } },
    });
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }
    if (branch.isDefault) {
      return res.status(400).json({ msg: "Cannot delete the default branch" });
    }

    await prisma.branch.delete({ where: { id: branch.id } });

    return res.status(200).json({ msg: `Branch '${branchName}' deleted` });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error deleting branch", error: errMsg });
  }
};
