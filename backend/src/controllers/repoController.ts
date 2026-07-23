import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { logActivity, removeActivity } from "../utils/activityLogger.js";

export const createRepository = async (req: Request, res: Response) => {
  const { name, description, content, visibility } = req.body;
  const ownerId = req.userId;

  try {
    if (!name) {
      return res.status(400).json({
        msg: "Name of the repository is required !",
      });
    }

    if (!Array.isArray(content)) {
      return res.status(400).json({
        msg: "Invalid input format - Content field should be an array",
      });
    }

    if (!ownerId) {
      return res.status(400).json({
        msg: "Required field ownerID is missing !",
      });
    }

    const createdRepo = await prisma.repository.create({
      data: {
        name,
        description,
        content,
        visibility: visibility ?? true,
        ownerId: ownerId,
      },
    });

    await logActivity(ownerId, "REPO_CREATED", {
      repoId: createdRepo.id,
      repoName: createdRepo.name,
      visibility: createdRepo.visibility,
    });

    return res.status(201).json({
      msg: "Repository created successfully !",
      createdRepo,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);

    return res.status(500).json({
      msg: `Some error occured while creating the repository - ${errMsg}`,
    });
  }
};

export const getAllRepositories = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [repos, total] = await Promise.all([
      prisma.repository.findMany({
        skip,
        take: limit,
        include: {
          owner: { select: { id: true, username: true } },
          _count: { select: { starredBy: true, pinnedBy: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.repository.count(),
    ]);

    return res.status(200).json({
      msg: "Successfully fetched all repositories !",
      repos: repos.map((r) => ({
        ...r,
        starCount: r._count.starredBy,
        pinCount: r._count.pinnedBy,
        _count: undefined,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);

    return res.status(500).json({
      msg: `Error occurred while fetching the repositories - ${errMsg}`,
    });
  }
};

export const fetchRepositoryByID = async (req: Request, res: Response) => {
  const repoId = req.params.id;

  if (!repoId) {
    return res.status(400).json({
      msg: "ID is required !",
    });
  }

  try {
    const repo = await prisma.repository.findUnique({
      where: { id: String(repoId) },
      include: {
        owner: { select: { id: true, username: true } },
        _count: { select: { starredBy: true, pinnedBy: true } },
      },
    });

    if (repo) {
      return res.json({
        msg: "Repo successfully fetched !",
        repo: {
          ...repo,
          starCount: repo._count.starredBy,
          pinCount: repo._count.pinnedBy,
          _count: undefined,
        },
      });
    }

    return res.status(404).json({
      msg: "Repository with this ID not found !",
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while fetching the repositories - ${errMsg}`,
    });
  }
};

export const fetchRepositoryByName = async (req: Request, res: Response) => {
  const name = req.params.name;
  const ownerId = req.query.ownerId as string | undefined;

  try {
    const where: Record<string, unknown> = {
      name: { contains: String(name), mode: "insensitive" },
    };
    if (ownerId) {
      where.ownerId = ownerId;
    }

    const repos = await prisma.repository.findMany({
      where,
      include: {
        owner: { select: { id: true, username: true } },
        _count: { select: { starredBy: true, pinnedBy: true } },
      },
    });

    return res.status(200).json({
      msg: "Fetched repository successfully !",
      repos: repos.map((r) => ({
        ...r,
        starCount: r._count.starredBy,
        pinCount: r._count.pinnedBy,
        _count: undefined,
      })),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while fetching the repositories - ${errMsg}`,
    });
  }
};

export const fetchRepositoriesForCurrentUser = async (
  req: Request,
  res: Response,
) => {
  const userId = req.params.userID;

  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [userRepos, total] = await Promise.all([
      prisma.repository.findMany({
        where: { ownerId: String(userId) },
        skip,
        take: limit,
        include: {
          owner: { select: { id: true, username: true } },
          _count: { select: { starredBy: true, pinnedBy: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.repository.count({ where: { ownerId: String(userId) } }),
    ]);

    return res.status(200).json({
      msg: "Successfully fetched the repositories of the user",
      userRepos: userRepos.map((r) => ({
        ...r,
        starCount: r._count.starredBy,
        pinCount: r._count.pinnedBy,
        _count: undefined,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Some error occurred while getting the repositories of this user - ${errMsg}`,
    });
  }
};

export const updateRepositoryByID = async (req: Request, res: Response) => {
  const repoId = String(req.params.id);
  const userId = req.userId;
  const { name, description, visibility } = req.body;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const existing = await prisma.repository.findUnique({
      where: { id: repoId },
    });

    if (!existing) {
      return res.status(404).json({ msg: "Repository not found" });
    }

    if (existing.ownerId !== userId) {
      return res.status(403).json({ msg: "Forbidden: You can only update your own repositories" });
    }

    const updated = await prisma.repository.update({
      where: { id: repoId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(visibility !== undefined && { visibility }),
      },
    });

    return res.status(200).json({ msg: "Repository updated successfully", updatedRepo: updated });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error updating repository", error: errMsg });
  }
};

export const toggleVisibilityByID = async (req: Request, res: Response) => {
  const repoId = String(req.params.id);
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const existing = await prisma.repository.findUnique({
      where: { id: repoId },
    });

    if (!existing) {
      return res.status(404).json({ msg: "Repository not found" });
    }

    if (existing.ownerId !== userId) {
      return res.status(403).json({ msg: "Forbidden: You can only toggle your own repositories" });
    }

    const updated = await prisma.repository.update({
      where: { id: repoId },
      data: { visibility: !existing.visibility },
    });

    return res.status(200).json({
      msg: `Repository visibility toggled to ${updated.visibility ? "public" : "private"}`,
      updatedRepo: updated,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error toggling visibility", error: errMsg });
  }
};

export const deleteRepositoryByID = async (req: Request, res: Response) => {
  const repoId = String(req.params.id);
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  try {
    const repository = await prisma.repository.findUnique({
      where: { id: repoId },
    });

    if (!repository) {
      return res.status(404).json({
        msg: "Repository not found",
      });
    }

    if (repository.ownerId !== userId) {
      return res.status(403).json({
        msg: "Forbidden: You can only delete your own repositories",
      });
    }

    const deletedRepo = await prisma.repository.delete({
      where: { id: repoId },
    });

    await removeActivity(userId, "REPO_CREATED", {
      repoId: repoId,
    });

    return res.status(200).json({
      msg: "Repository deleted successfully and contribution count updated",
      deletedRepo,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: "Error while deleting repository",
      error: errMsg,
    });
  }
};

export const forkRepository = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const original = await prisma.repository.findUnique({
      where: { id: repoId },
      include: { owner: { select: { username: true } } },
    });
    if (!original) {
      return res.status(404).json({ msg: "Repository not found" });
    }
    if (!original.visibility) {
      return res.status(403).json({ msg: "Cannot fork a private repository" });
    }

    const existingFork = await prisma.repository.findUnique({
      where: { ownerId_name: { ownerId: userId, name: original.name } },
    });
    if (existingFork) {
      return res.status(409).json({
        msg: "You already have a fork with this name",
        existingForkId: existingFork.id,
      });
    }

    const fork = await prisma.repository.create({
      data: {
        name: original.name,
        description: original.description ? `Fork of ${original.owner.username}/${original.name}` : null,
        content: [""],
        visibility: true,
        ownerId: userId,
        forkedFromId: original.id,
        defaultBranch: original.defaultBranch,
      },
    });

    const defaultBranch = await prisma.branch.findFirst({
      where: { repositoryId: repoId, isDefault: true },
      include: { commits: { orderBy: { createdAt: "desc" }, take: 1, include: { files: true } } },
    });

    if (defaultBranch) {
      const newBranch = await prisma.branch.create({
        data: {
          name: defaultBranch.name,
          repositoryId: fork.id,
          authorId: userId,
          isDefault: true,
        },
      });

      if (defaultBranch.commits.length > 0) {
        const latestCommit = defaultBranch.commits[0];
        const forkCommit = await prisma.commit.create({
          data: {
            message: `Fork from ${original.owner.username}/${original.name}`,
            branchId: newBranch.id,
            repositoryId: fork.id,
            authorId: userId,
          },
        });

        for (const file of latestCommit!.files) {
          await prisma.commitFile.create({
            data: {
              commitId: forkCommit.id,
              filename: file.filename,
              s3Key: file.s3Key || "",
              content: file.content,
              size: file.size,
              additions: file.size,
              deletions: 0,
            },
          });
        }
      }
    }

    await logActivity(userId, "FORK", {
      originalRepoId: repoId,
      forkRepoId: fork.id,
      originalOwner: original.owner.username,
    });

    return res.status(201).json({
      msg: "Repository forked successfully",
      fork: {
        id: fork.id,
        name: fork.name,
        forkedFromId: fork.forkedFromId,
        ownerId: fork.ownerId,
        createdAt: fork.createdAt,
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error forking repository", error: errMsg });
  }
};

export const getForkedFrom = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);

  try {
    const repo = await prisma.repository.findUnique({
      where: { id: repoId },
      select: { forkedFromId: true },
    });
    if (!repo || !repo.forkedFromId) {
      return res.status(200).json({ msg: "Not a fork", forkedFrom: null });
    }

    const original = await prisma.repository.findUnique({
      where: { id: repo.forkedFromId },
      select: { id: true, name: true, owner: { select: { id: true, username: true } } },
    });

    return res.status(200).json({ msg: "Forked from fetched", forkedFrom: original });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg: "Error fetching fork info", error: errMsg });
  }
};
