import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const createIssue = async (req: Request, res: Response) => {
  
  const { title, description, status, repoID, creatorID } = req.body;

  if ( !title || !status || !repoID || !creatorID ) {
    return res.status(400).json({
      msg: `Fields title, status, repoID, creatorID are required !`
    })
  }

  try {

    const createdIssue = await prisma.issue.create({
      data: {
        title: title,
        description: description,
        status: status,
        repositoryId: repoID,
        authorId: creatorID
      }
    })

    if (createdIssue) {
      return res.status(201).json({
        msg: `Issue created successfully !`,
        createdIssue
      })
    }

    return res.status(400).json({
      msg: `Some error occurred while creating the issue`
    })
    
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while creating the issue ${errMsg}`
    })
  }

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

