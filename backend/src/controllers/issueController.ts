import type { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { logActivity, removeActivity } from "../utils/activityLogger.js";

export const createIssue = async (req: Request, res: Response) => {
  const { title, description, status, repoID } = req.body;
  const authorId = req.userId;

  if (!title || !description || !status || !repoID) {
    return res.status(400).json({
      msg: "Fields title, description, status, repoID are required !",
    });
  }

  if (!authorId) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  try {
    const repo = await prisma.repository.findUnique({
      where: { id: repoID },
    });

    if (!repo) {
      return res.status(404).json({
        msg: "Repository not found",
      });
    }

    const createdIssue = await prisma.issue.create({
      data: {
        title,
        description,
        status,
        repositoryId: repoID,
        authorId,
      },
    });

    await logActivity(authorId, "ISSUE_CREATED", {
      issueId: createdIssue.id,
      issueTitle: createdIssue.title,
      repositoryId: repoID,
    });

    return res.status(201).json({
      msg: "Issue created successfully !",
      createdIssue,
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
  const userId = req.userId;

  if (title === undefined && description === undefined && status === undefined) {
    return res.status(400).json({
      msg: "At least one of the fields (title, description, status) is required !",
    });
  }

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
      where: { id: String(issueID) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
    });

    if (status === "closed" && existingIssue.status !== "closed") {
      await logActivity(existingIssue.authorId, "ISSUE_CLOSED", {
        issueId: updatedIssue.id,
        issueTitle: updatedIssue.title,
        repositoryId: existingIssue.repositoryId,
      });
    }

    return res.status(200).json({
      msg: "Issue updated successfully !",
      updatedIssue,
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
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const issue = await prisma.issue.findUnique({
      where: { id: String(issueID) },
    });

    if (!issue) {
      return res.status(404).json({
        msg: "Issue with this ID not found !",
      });
    }

    const deletedIssue = await prisma.issue.delete({
      where: { id: String(issueID) },
    });

    await removeActivity(issue.authorId, "ISSUE_CREATED", {
      issueId: issueID,
    });

    if (issue.status === "closed") {
      await removeActivity(issue.authorId, "ISSUE_CLOSED", {
        issueId: issueID,
      });
    }

    return res.status(200).json({
      msg: "Issue deleted successfully and contribution count updated",
      deletedIssue,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while deleting the issue - ${errMsg}`,
    });
  }
};

export const getAllIssuesOfARepo = async (req: Request, res: Response) => {
  const repoID = req.params.id;

  try {
    const issues = await prisma.issue.findMany({
      where: {
        repositoryId: String(repoID),
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      msg: "Issues fetched successfully !",
      issues: issues ?? [],
    });
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
      where: { id: String(issueID) },
    });

    if (!issue) {
      return res.status(404).json({
        msg: "Issue with this ID not found !",
      });
    }

    return res.status(200).json({
      msg: "Issue fetched !",
      issue,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      msg: `Error occurred while fetching the issue - ${errMsg}`,
    });
  }
};
