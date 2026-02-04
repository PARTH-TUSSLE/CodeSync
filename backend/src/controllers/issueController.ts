import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const createIssue = async (req: Request, res: Response) => {
  const { title, description, status, repoID, creatorID } = req.body;

  if (!title || !status || !repoID || !creatorID) {
    return res.status(400).json({
      msg: `Fields title, status, repoID, creatorID are required !`,
    });
  }

  try {
    const createdIssue = await prisma.issue.create({
      data: {
        title: title,
        description: description,
        status: status,
        repositoryId: repoID,
        authorId: creatorID,
      },
    });

    if (createdIssue) {
      return res.status(201).json({
        msg: `Issue created successfully !`,
        createdIssue,
      });
    }

    return res.status(400).json({
      msg: `Some error occurred while creating the issue`,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while creating the issue ${errMsg}`,
    });
  }
};

export const updateIssueByID = async (req: Request, res: Response) => {
  const { title, description, status } = req.body;
  const issueID = req.params.id;

  try {

    const existingIssue = await prisma.issue.findUnique({
      where: { id: String(issueID) },
    });

    if (!existingIssue) {
      return res.status(404).json({
        msg: "Issue with this ID not found",
      });
    }

    const updatedIssue = await prisma.issue.update({
      where: {
        id: String(issueID),
      },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
      },
    });

    return res.status(200).json({
      msg: "Issue update successfully !",
      updatedIssue
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while updating the issue - ${errMsg}`,
    });
  }
};

export const deleteIssueByID = async (req: Request, res: Response) => {
  
  const issueID = req.params.id;

  try {

    const deletedIssue = await prisma.issue.delete({
      where: {
        id: String(issueID)
      }
    });

    if (!deletedIssue) {
      return res.status(404).json({
        msg: "Issue with this ID not found !"
      })
    }

    return res.status(200).json({
      msg: "Issue deleted successfully !",
      deletedIssue
    })

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while deleting the issue - ${errMsg}`,
    });
  }

};

export const getAllIssues = async (req: Request, res: Response) => {
  
  const repoID = req.params.id;
  
  try {

    const issues = await prisma.issue.findMany({
      where: {
        repositoryId: String(repoID)
      }
    })

    if (!issues || issues.length == 0) {
      return res.status(404).json({
        msg: "Invalid repository ID"
      })
    }

    return res.status(200).json({
      msg: "Issues fetched successfully !",
      issues
    })

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while fetching the issues - ${errMsg}`,
    });
  }

};

export const getIssueByID = async (req: Request, res: Response) => {

  const issueID = req.params.id;

  try {

    const issue = await prisma.issue.findUnique({
      where: {
        id: String(issueID)
      }
    }) 

    if ( !issue ) {
      return res.status(404).json({
        msg: "Issue with this ID not found !"
      })
    }

    return res.status(200).json({
      msg: "Issue fetched !",
      issue
    })

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while fetching the issue - ${errMsg}`,
    });
  }

};
