import type { Request, Response } from "express";

export const createIssue = (req: Request, res: Response) => {
  res.send("Issue created");
};

export const updateIssueByID = (req: Request, res: Response) => {
  res.send("Issue updated!");
};

export const deleteIssueByID = (req: Request, res: Response) => {
  res.send("Issue deleted!");
};

export const getAllIssues = (req: Request, res: Response) => {
  res.send("Issues fetched!");
};

export const getIssueByID = (req: Request, res: Response) => {
  res.send("Issue with ID fetched!");
};

