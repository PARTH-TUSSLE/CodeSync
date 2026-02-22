import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { logActivity } from "../utils/activityLogger.js";

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

    if ( !ownerId ) {
      return res.status(400).json({
        msg: "Required field ownerID is missing !"
      })
    }

    const createdRepo = await prisma.repository.create({
      data: {
        name,
        description,
        content,
        visibility: visibility ? visibility : true,
        ownerId: ownerId,
      },
    });

    // L7og the activity for contribution tracking
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
    const repos = await prisma.repository.findMany({});

    return res.status(200).json({
      msg: "Successfully fetched all repositories !",
      repos,
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
      where: {
        id: String(repoId),
      },
    });

    if (repo) {
      return res.json({
        msg: "Repo successfully fetched !",
        repo,
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

  const name  = req.params.name;
  // const { ownerID } = req.body;

  try {

    const repos = await prisma.repository.findMany({
      where: {
        name: String(name),
        // ownerId: ownerID
      }
    })

    if (repos && repos.length !== 0) {
      return res.status(200).json({
        msg: "Fetched repository successfully !",
        repos
      })
    }  

    return res.status(404).json({
      msg: "Repository with this name not found !"
    })

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
    
    const userRepos = await prisma.repository.findMany({
      where: {
        ownerId: String(userId)
      }
    });

    if ( !userRepos || userRepos.length === 0 ) {
      return res.status(404).json({
        msg: "No repositories found !"
      })
    }

    return res.status(200).json({
      msg: "Successfully fetched the repositories of the user",
      userRepos
    })

  } catch (error) {
    const errMsg = error instanceof Error? error.message : String(error);
    return res.status(500).json({
      msg: `Some error occurred while getting the repositories of this user - ${errMsg}`
    })
  }

};

export const updateRepositoryByID = (req: Request, res: Response) => {
  res.send("Updated repo by ID");
};

export const toggleVisibilityByID = (req: Request, res: Response) => {
  res.send("toggled the visibility of repo");
};

export const deleteRepositoryByID = (req: Request, res: Response) => {
  res.send("Deleted repo by ID");
};
