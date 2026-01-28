import type { Request, Response } from "express";

export const createRepository = (req: Request, res: Response) => {
  res.send("Created repository");
};

export const getAllRepositories = (req: Request, res: Response) => {
  res.send("Fetched all repositories");
};

export const fetchRepositoryByID = (req: Request, res: Response) => {
  res.send("Fetched repo by ID");
};

export const fetchRepositoryByName = (req: Request, res: Response) => {
  res.send("Fetched repo by name");
};

export const fetchRepositoriesForCurrentUser = (req: Request, res: Response) => {
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
