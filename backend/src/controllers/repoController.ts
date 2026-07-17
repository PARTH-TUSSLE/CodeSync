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
    const where: Record<string, unknown> = { name: String(name) };
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
