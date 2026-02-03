import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const createRepository = async (req: Request, res: Response) => {
  const { name, description, content, visibility, ownerId } =
    req.body;

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

    const createdRepo = await prisma.repository.create({
      data: {
        name,
        description,
        content,
        visibility: visibility ? visibility : true,
        ownerId: ownerId,
      },
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
      repos
    })
    
  } catch (error) {

    const errMsg = error instanceof Error? error.message : String(error)

    return res.status(500).json({
      msg: `Error occurred while fetching the repositories - ${errMsg}`
    })

  }
};

export const fetchRepositoryByID = (req: Request, res: Response) => {
  res.send("Fetched repo by ID");
};

export const fetchRepositoryByName = (req: Request, res: Response) => {
  res.send("Fetched repo by name");
};

export const fetchRepositoriesForCurrentUser = (
  req: Request,
  res: Response,
) => {
  res.send("Fetched repos for the logged in user");
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
