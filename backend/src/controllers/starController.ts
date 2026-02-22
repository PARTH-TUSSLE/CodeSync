import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { logActivity } from "../utils/activityLogger.js";

export const starRepository = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const userId = req.userId; 

  if (!userId) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  try {
    // Check if repository exists
    const repository = await prisma.repository.findUnique({
      where: { id: repoId },
    });

    if (!repository) {
      return res.status(404).json({
        msg: "Repository not found",
      });
    }

    // Add the repository to user's starred repos
    await prisma.user.update({
      where: { id: userId },
      data: {
        starredRepos: {
          connect: { id: repoId },
        },
      },
    });


    await logActivity(userId, "STARRED_REPO", {
      repoId: repoId,
      repoName: repository.name,
    });

    return res.status(200).json({
      msg: "Repository starred successfully",
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: "Error while starring repository",
      error: errMsg,
    });
  }
};

export const unstarRepository = async (req: Request, res: Response) => {
  const repoId = String(req.params.repoId);
  const userId = req.userId; // From auth middleware

  if (!userId) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  try {
    // Remove the repository from user's starred repos
    await prisma.user.update({
      where: { id: userId },
      data: {
        starredRepos: {
          disconnect: { id: repoId },
        },
      },
    });

    return res.status(200).json({
      msg: "Repository unstarred successfully",
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: "Error while unstarring repository",
      error: errMsg,
    });
  }
};

export const getStarredRepositories = async (req: Request, res: Response) => {
  const userId = String(req.params.userId);

  try {
    const userWithStarredRepos = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        starredRepos: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!userWithStarredRepos) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    return res.status(200).json({
      msg: "Starred repositories fetched successfully",
      starredRepos: userWithStarredRepos.starredRepos,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: "Error while fetching starred repositories",
      error: errMsg,
    });
  }
};
